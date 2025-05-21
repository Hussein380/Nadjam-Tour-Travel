import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MicIcon, BrainCircuit, ShieldCheck, HeartPulse, ArrowRight, Sparkles, Wand2 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-white/5 backdrop-blur-md fixed w-full z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold gradient-text">MindVoice</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/(auth)/sign-in">
              <Button variant="ghost" className="text-white/70 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/(auth)/sign-up">
              <Button className="btn-gradient">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-32 md:py-40 gradient-bg relative overflow-hidden">
          <div className="grid-pattern absolute inset-0 z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center rounded-full border border-rose-500/30 bg-background/50 px-3 py-1 text-sm backdrop-blur-md w-fit">
                  <Sparkles className="mr-1 h-3.5 w-3.5 text-rose-500" />
                  <span className="text-rose-500">AI-Powered Mental Health</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none glow-text">
                  Your <span className="gradient-text">AI Mental Health</span> Companion
                </h1>
                <p className="text-lg text-white/70 max-w-[600px] leading-relaxed">
                  Experience supportive conversations, guided therapy sessions, and personalized mental health
                  assessments through our advanced voice-activated AI assistant.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/(auth)/sign-up">
                    <Button size="lg" className="btn-gradient">
                      <MicIcon className="mr-2 h-4 w-4" />
                      Start Talking Now
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline" className="border-rose-500/30 text-white hover:bg-rose-500/10">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-[400px] animate-float">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-[250px] w-[250px] rounded-full bg-gradient-to-b from-rose-500/20 to-purple-600/20 flex items-center justify-center">
                      <MicIcon className="h-24 w-24 text-rose-500 animate-pulse" />
                      <div className="absolute inset-0 rounded-full border border-rose-500/30 pulse-ring"></div>
                      <div
                        className="absolute inset-0 rounded-full border border-purple-600/20 pulse-ring"
                        style={{ animationDelay: "0.5s" }}
                      ></div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div
                    className="absolute top-10 right-20 bg-black/40 backdrop-blur-md p-3 rounded-xl flex items-center gap-2 animate-float border border-white/5"
                    style={{ animationDelay: "1s" }}
                  >
                    <Wand2 className="h-5 w-5 text-purple-400" />
                    <span className="text-sm">AI Therapy</span>
                  </div>

                  <div
                    className="absolute bottom-20 left-10 bg-black/40 backdrop-blur-md p-3 rounded-xl flex items-center gap-2 animate-float border border-white/5"
                    style={{ animationDelay: "1.5s" }}
                  >
                    <BrainCircuit className="h-5 w-5 text-rose-400" />
                    <span className="text-sm">Neural Analysis</span>
                  </div>

                  <div
                    className="absolute bottom-40 right-0 bg-black/40 backdrop-blur-md p-3 rounded-xl flex items-center gap-2 animate-float border border-white/5"
                    style={{ animationDelay: "2s" }}
                  >
                    <ShieldCheck className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">Secure & Private</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section-spacing relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-rose-500/30 bg-background/50 px-3 py-1 text-sm backdrop-blur-md">
                <Sparkles className="mr-1 h-3.5 w-3.5 text-rose-500" />
                <span className="text-rose-500">Advanced Features</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                  Cutting-Edge Technology
                </h2>
                <p className="max-w-[800px] text-white/70 text-lg mx-auto">
                  Our AI-powered voice assistant provides comprehensive mental health support using the latest
                  advancements in artificial intelligence
                </p>
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="feature-item">
                <div className="feature-icon">
                  <MicIcon className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Voice Conversations</h3>
                <p className="text-white/70">
                  Natural voice interactions that feel like talking to a supportive friend or therapist, powered by
                  advanced language models
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <BrainCircuit className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Guided Therapy</h3>
                <p className="text-white/70">
                  Evidence-based therapeutic techniques delivered through conversational AI with personalized insights
                  and recommendations
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <ShieldCheck className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Private & Secure</h3>
                <p className="text-white/70">
                  Your conversations and data are encrypted and protected with the highest security standards, ensuring
                  complete confidentiality
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-emerald-500"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">24/7 Availability</h3>
                <p className="text-white/70">
                  Access mental health support whenever you need it, day or night, without scheduling appointments or
                  waiting for availability
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-amber-500"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Personalized Insights</h3>
                <p className="text-white/70">
                  Receive tailored insights and recommendations based on your conversations, progress, and mental health
                  needs
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-pink-500"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
                <p className="text-white/70">
                  Monitor your mental health journey with detailed analytics, mood tracking, and progress reports over
                  time
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="section-spacing gradient-bg relative overflow-hidden">
          <div className="grid-pattern absolute inset-0 z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
              <div className="inline-flex items-center rounded-full border border-rose-500/30 bg-background/50 px-3 py-1 text-sm backdrop-blur-md">
                <Sparkles className="mr-1 h-3.5 w-3.5 text-rose-500" />
                <span className="text-rose-500">Simple Process</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                  How It Works
                </h2>
                <p className="max-w-[800px] text-white/70 text-lg mx-auto">
                  Simple steps to start your mental health journey with our advanced voice assistant
                </p>
              </div>
            </div>

            <div className="space-y-24">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center absolute -left-8 top-0 z-10">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                    <div className="pl-12">
                      <h3 className="text-2xl font-bold mb-4 gradient-text">Create an Account</h3>
                      <p className="text-white/70 mb-6 text-lg">
                        Sign up and complete a brief initial assessment to help us understand your needs and personalize
                        your experience.
                      </p>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-rose-500/20 flex items-center justify-center mt-0.5">
                            <span className="text-xs text-rose-500">→</span>
                          </div>
                          <span className="text-white/80">Create your secure profile</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-rose-500/20 flex items-center justify-center mt-0.5">
                            <span className="text-xs text-rose-500">→</span>
                          </div>
                          <span className="text-white/80">Complete initial assessment</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-rose-500/20 flex items-center justify-center mt-0.5">
                            <span className="text-xs text-rose-500">→</span>
                          </div>
                          <span className="text-white/80">Set your preferences and goals</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2">
                  <div className="relative h-[300px] w-full bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white/50 text-lg">Account Creation Interface</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                  <div className="relative h-[300px] w-full bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white/50 text-lg">Voice Session Interface</div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center absolute -left-8 top-0 z-10">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <div className="pl-12">
                      <h3 className="text-2xl font-bold mb-4 gradient-text">Start a Session</h3>
                      <p className="text-white/70 mb-6 text-lg">
                        Begin a voice conversation with our AI assistant about how you're feeling, what's on your mind,
                        or specific challenges you're facing.
                      </p>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                            <span className="text-xs text-purple-500">→</span>
                          </div>
                          <span className="text-white/80">Tap the microphone button to start talking</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                            <span className="text-xs text-purple-500">→</span>
                          </div>
                          <span className="text-white/80">Share your thoughts and feelings</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                            <span className="text-xs text-purple-500">→</span>
                          </div>
                          <span className="text-white/80">Receive real-time support and guidance</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center absolute -left-8 top-0 z-10">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <div className="pl-12">
                      <h3 className="text-2xl font-bold mb-4 gradient-text">Track Your Progress</h3>
                      <p className="text-white/70 mb-6 text-lg">
                        Review insights from your sessions and see your mental health journey over time with detailed
                        analytics and personalized recommendations.
                      </p>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                            <span className="text-xs text-blue-500">→</span>
                          </div>
                          <span className="text-white/80">View session history and insights</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                            <span className="text-xs text-blue-500">→</span>
                          </div>
                          <span className="text-white/80">Monitor mood trends and patterns</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                            <span className="text-xs text-blue-500">→</span>
                          </div>
                          <span className="text-white/80">Receive personalized recommendations</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2">
                  <div className="relative h-[300px] w-full bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white/50 text-lg">Progress Tracking Interface</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="section-spacing relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-rose-500/30 bg-background/50 px-3 py-1 text-sm backdrop-blur-md">
                <Sparkles className="mr-1 h-3.5 w-3.5 text-rose-500" />
                <span className="text-rose-500">User Stories</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                  What Our Users Say
                </h2>
                <p className="max-w-[800px] text-white/70 text-lg mx-auto">
                  Hear from people who have experienced the benefits of our mental health voice assistant
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/5">
                <div className="mb-6">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-rose-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-white/70 mb-8 text-lg leading-relaxed">
                  "I was skeptical at first, but talking to the AI has become a daily ritual that helps me process my
                  thoughts and feelings. It's like having a therapist available 24/7, and the insights have been
                  incredibly valuable."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-500/30 to-purple-600/30 flex items-center justify-center">
                    <span className="text-base font-medium text-rose-400">SK</span>
                  </div>
                  <div>
                    <p className="font-medium">Sarah K.</p>
                    <p className="text-sm text-white/50">Using MindVoice for 6 months</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/5">
                <div className="mb-6">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-rose-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-white/70 mb-8 text-lg leading-relaxed">
                  "The guided breathing exercises and mindfulness sessions have helped me manage my anxiety better than
                  anything else I've tried. The voice interface makes it so accessible, and I can use it anywhere."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-600/30 flex items-center justify-center">
                    <span className="text-base font-medium text-purple-400">MT</span>
                  </div>
                  <div>
                    <p className="font-medium">Michael T.</p>
                    <p className="text-sm text-white/50">Using MindVoice for 3 months</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/5">
                <div className="mb-6">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-rose-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-white/70 mb-8 text-lg leading-relaxed">
                  "As someone who struggled to find time for therapy, MindVoice has been a game-changer. The progress
                  tracking helps me see how far I've come, and the personalized insights are spot on."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/30 to-emerald-600/30 flex items-center justify-center">
                    <span className="text-base font-medium text-blue-400">JL</span>
                  </div>
                  <div>
                    <p className="font-medium">Jennifer L.</p>
                    <p className="text-sm text-white/50">Using MindVoice for 8 months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-spacing gradient-bg relative overflow-hidden">
          <div className="grid-pattern absolute inset-0 z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="inline-flex items-center rounded-full border border-rose-500/30 bg-background/50 px-3 py-1 text-sm backdrop-blur-md">
                <Sparkles className="mr-1 h-3.5 w-3.5 text-rose-500" />
                <span className="text-rose-500">Get Started Today</span>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text glow-text">
                  Ready to Transform Your Mental Health?
                </h2>
                <p className="max-w-[800px] text-white/70 text-lg mx-auto">
                  Join thousands of users who are improving their mental health with our AI voice assistant
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-4">
                <Link href="/(auth)/sign-up">
                  <Button size="lg" className="w-full btn-gradient text-lg py-6">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-sm text-white/50">No credit card required. Start with our free plan today.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/10 py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-rose-500" />
            <p className="text-white/50">© 2024 MindVoice. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-white/50 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white/50 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-white/50 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
