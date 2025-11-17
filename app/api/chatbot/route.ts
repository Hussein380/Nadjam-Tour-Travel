import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

const CONTACTS = `Emails: nadjamtour@gmail.com, info@nadjamtravel.co.ke\nPhones: 0725996394, 0706686349\nAddress: Eastleigh, 7th street, Nairobi`;
const SYSTEM_PROMPT = `You are NadjamTravel AI, a helpful travel assistant for Nadjam Travel.\n\n- Answer ONLY using the provided context (hotels, packages, contacts).\n- If you don't know the answer, politely refer the user to our contacts.\n- Do NOT answer or discuss sex, harm, or any sensitive or out-of-scope topics.\n- Support both English and Swahili.\n- If the user asks in Swahili, answer in Swahili.\n- Always be polite and professional.\n- If the user asks about custom packages, mention that custom packages are available.\n`;

export async function POST(req: NextRequest) {
    try {
        const { message, language } = await req.json();

        // Security: Validate and sanitize input
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return NextResponse.json({ answer: "Please provide a valid message." }, { status: 400 });
        }
        const sanitizedMessage = message.trim();

        // Security: Check if API key exists without logging it
        if (!process.env.GEMINI_API_KEY) {
            console.error('Gemini API key is missing!');
            return NextResponse.json({ answer: "Server misconfiguration: Gemini API key missing." }, { status: 500 });
        }

        // Fetch data from Firestore
        const hotelsSnap = await db.collection('hotels').get();
        const packagesSnap = await db.collection('packages').get();

        // Build context from hotels and packages
        const hotels = hotelsSnap.docs.map(doc => {
            const d = doc.data();
            return `${d.name} (${d.location}) - from $${d.price}/night`;
        }).join('\n');
        const packages = packagesSnap.docs.map(doc => {
            const d = doc.data();
            return `${d.title}: ${d.description} - $${d.price}`;
        }).join('\n');
        const context = `Hotels:\n${hotels}\n\nPackages:\n${packages}\n\nContact Info:\n${CONTACTS}`;

        // Build prompt
        const prompt = `${SYSTEM_PROMPT}\n\nContext:\n${context}\n\nUser: ${sanitizedMessage}`;

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        
        // Helper function to retry API calls with exponential backoff
        const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3, baseDelay = 1000) => {
            for (let attempt = 0; attempt < maxRetries; attempt++) {
                try {
                    return await fn();
                } catch (error: any) {
                    // Check for retryable errors (503 Service Unavailable, 429 Too Many Requests)
                    const status = error?.status || error?.response?.status;
                    const message = error?.message || '';
                    const isRetryable = status === 503 || status === 429 || 
                                       message.includes('overloaded') || 
                                       message.includes('too many requests');
                    
                    if (!isRetryable || attempt === maxRetries - 1) {
                        throw error;
                    }
                    const delay = baseDelay * Math.pow(2, attempt);
                    // Wait before retry (silent retry for security)
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        };

        // Try models in order with retry logic
        const modelNames = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
        let result;
        let lastError: any;

        for (const modelName of modelNames) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                
                result = await retryWithBackoff(async () => {
                    return await model.generateContent({
                        contents: [
                            {
                                role: 'user',
                                parts: [
                                    { text: prompt }
                                ]
                            }
                        ]
                    });
                });
                
                break; // Success, exit loop
            } catch (error: any) {
                lastError = error;
                const status = error?.status || error?.response?.status;
                const message = error?.message || '';
                const isNotFound = status === 404 || message.includes('not found') || message.includes('404');
                const isOverloaded = status === 503 || message.includes('overloaded') || message.includes('Service Unavailable');
                
                // If it's 404, try next model
                // If it's 503 after retries, also try next model as fallback
                // For other errors (auth, etc.), throw immediately
                if (!isNotFound && !isOverloaded) {
                    throw error;
                }
                
                // Continue to next model silently
            }
        }

        if (!result) {
            throw lastError || new Error('All models failed');
        }

        // Extract response from Gemini API
        const answer = result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
            (language === 'sw'
                ? 'Samahani, siwezi kupata jibu sahihi. Tafadhali wasiliana nasi kwa maelezo zaidi.'
                : "Sorry, I couldn't find an answer. Please contact us for more info.");

        return NextResponse.json({ answer });
    } catch (err) {
        // Log error for server-side debugging (without exposing sensitive info to client)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Chatbot API error:', errorMessage);
        
        // Return generic error message to client (never expose internal errors)
        return NextResponse.json({ 
            answer: "Sorry, something went wrong. Please contact us directly via email or phone. +254706686349 or nadjamtour@gmail.com" 
        }, { status: 500 });
    }
} 