import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

const CONTACTS = `Emails: nadjamtour@gmail.com, info@nadjamtravel.co.ke\nPhones: 0725996394, 0706686349\nAddress: Eastleigh, 7th street, Nairobi`;
const SYSTEM_PROMPT = `You are NadjamTravel AI, a helpful travel assistant for Nadjam Travel.\n\n- Answer ONLY using the provided context (hotels, packages, contacts).\n- If you don't know the answer, politely refer the user to our contacts.\n- Do NOT answer or discuss sex, harm, or any sensitive or out-of-scope topics.\n- Support both English and Swahili.\n- If the user asks in Swahili, answer in Swahili.\n- Always be polite and professional.\n- If the user asks about custom packages, mention that custom packages are available.\n`;

export async function POST(req: NextRequest) {
    try {
        const { message, language } = await req.json();

        // LOG: Check if env is loaded
        console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);

        if (!process.env.GEMINI_API_KEY) {
            console.error('Gemini API key is missing!');
            return NextResponse.json({ answer: "Server misconfiguration: Gemini API key missing." }, { status: 500 });
        }

        // LOG: Check Firestore access
        const hotelsSnap = await db.collection('hotels').get();
        const packagesSnap = await db.collection('packages').get();
        console.log('Hotels count:', hotelsSnap.size, 'Packages count:', packagesSnap.size);

        // LOG: Check context construction
        const hotels = hotelsSnap.docs.map(doc => {
            const d = doc.data();
            return `${d.name} (${d.location}) - from $${d.price}/night`;
        }).join('\n');
        const packages = packagesSnap.docs.map(doc => {
            const d = doc.data();
            return `${d.title}: ${d.description} - $${d.price}`;
        }).join('\n');
        const context = `Hotels:\n${hotels}\n\nPackages:\n${packages}\n\nContact Info:\n${CONTACTS}`;
        console.log('Context length:', context.length);

        // LOG: Check prompt
        const prompt = `${SYSTEM_PROMPT}\n\nContext:\n${context}\n\nUser: ${message}`;
        console.log('Prompt length:', prompt.length);

        // LOG: Before Gemini call
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro', generationConfig: { apiVersion: 'v1' } });
        console.log('About to call Gemini API...');

        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        });

        // LOG: After Gemini call
        console.log('Gemini API call succeeded');
        const answer = result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
            (language === 'sw'
                ? 'Samahani, siwezi kupata jibu sahihi. Tafadhali wasiliana nasi kwa maelezo zaidi.'
                : "Sorry, I couldn't find an answer. Please contact us for more info.");

        return NextResponse.json({ answer });
    } catch (err) {
        console.error('Chatbot API error:', err);
        return NextResponse.json({ answer: "Sorry, something went wrong. Please contact us directly via email or phone. +254706686349 or nadjamtour@gmail.com" }, { status: 500 });
    }
} 