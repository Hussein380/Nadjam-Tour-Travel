"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, Sparkles } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  suggestions?: string[]
}

const quickSuggestions = [
  "🏨 Find hotels in Kenya",
  "✈️ Book flights to Dubai",
  "🎒 Safari packages",
  "🕌 Hajj & Umrah services",
  "💰 Best travel deals",
]

const BOT_NAME = "NadjamTravel AI"
const BOT_AVATAR = <Bot className="w-4 h-4" />
const THEME_COLOR = "from-blue-900 to-blue-700"
const DEFAULT_LANGUAGE = "en"
const WHATSAPP_NUMBER = "254725996394"
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`

const initialBotMessage = (lang: string): Message => ({
  id: "1",
  type: "bot",
  content: lang === "sw" ?
    "Habari! Mimi ni NadjamTravel AI, msaidizi wako wa kusafiri. Naweza kukusaidiaje leo?" :
    "Hello! I'm NadjamTravel AI, your personal travel assistant. How can I help you today?",
  timestamp: new Date(),
  suggestions: quickSuggestions,
})

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("nadjam_chat_history")
    const lang = localStorage.getItem("nadjam_chat_lang") || DEFAULT_LANGUAGE
    setLanguage(lang)
    if (saved) {
      // Parse and convert timestamps to Date objects
      const parsed = JSON.parse(saved).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
      setMessages(parsed)
    } else {
      setMessages([initialBotMessage(lang)])
    }
  }, [])

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem("nadjam_chat_history", JSON.stringify(messages))
  }, [messages])
  useEffect(() => {
    localStorage.setItem("nadjam_chat_lang", language)
  }, [language])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => { scrollToBottom() }, [messages])
  useEffect(() => { if (isOpen && !isMinimized) inputRef.current?.focus() }, [isOpen, isMinimized])

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, language }),
      })
      const data = await res.json()
      const botMessage: Message = {
        id: Date.now().toString() + "-bot",
        type: "bot",
        content: data.answer,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: Date.now().toString() + "-err",
        type: "bot",
        content: "Sorry, something went wrong. Please contact us directly.",
        timestamp: new Date(),
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value)
    setMessages([initialBotMessage(e.target.value)])
  }

  return (
    <>
      {/* WhatsApp Quick Contact */}
      {!isOpen && (
        <Button
          asChild
          size="icon"
          className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Nadjam Travel on WhatsApp"
          >
            <svg
              viewBox="0 0 32 32"
              className="w-7 h-7 text-white"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M16.04 2.01c-7.24 0-13.2 5.77-13.2 12.87 0 2.63.87 5.07 2.33 7.06L2 30l8.3-2.73a13.8 13.8 0 0 0 5.74 1.22c7.25 0 13.21-5.78 13.21-12.88 0-7.1-5.94-12.87-13.21-12.87Zm7.72 17.33c-.33.93-1.63 1.8-2.24 1.85-.57.05-1.28.08-2.07-.13-.48-.13-1.1-.36-1.9-.7-3.36-1.45-5.54-4.82-5.71-5.05-.16-.23-1.36-1.8-1.36-3.43 0-1.62.86-2.41 1.16-2.74.33-.34.71-.43.95-.43.24 0 .48 0 .69.01.22.01.52-.08.81.62.33.8 1.12 2.75 1.22 2.95.1.2.16.44.03.67-.13.23-.2.38-.4.58-.2.2-.42.45-.6.6-.2.17-.41.35-.18.68.23.34 1.02 1.7 2.19 2.75 1.51 1.35 2.78 1.77 3.17 1.97.39.2.62.17.85-.1.23-.27.98-1.15 1.24-1.54.26-.39.52-.33.86-.2.34.12 2.16 1.02 2.53 1.2.37.18.62.27.71.42.1.15.1.88-.23 1.81Z"
              />
            </svg>
          </a>
        </Button>
      )}

      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="icon"
        >
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[500px] shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          {/* Header */}
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Nadjam AI</CardTitle>
                  <p className="text-xs text-blue-100">Travel Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-white hover:bg-white/20"
                >
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open WhatsApp chat"
                  >
                    <svg
                      viewBox="0 0 32 32"
                      className="w-5 h-5 text-white"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M16.04 2.01c-7.24 0-13.2 5.77-13.2 12.87 0 2.63.87 5.07 2.33 7.06L2 30l8.3-2.73a13.8 13.8 0 0 0 5.74 1.22c7.25 0 13.21-5.78 13.21-12.88 0-7.1-5.94-12.87-13.21-12.87Zm7.72 17.33c-.33.93-1.63 1.8-2.24 1.85-.57.05-1.28.08-2.07-.13-.48-.13-1.1-.36-1.9-.7-3.36-1.45-5.54-4.82-5.71-5.05-.16-.23-1.36-1.8-1.36-3.43 0-1.62.86-2.41 1.16-2.74.33-.34.71-.43.95-.43.24 0 .48 0 .69.01.22.01.52-.08.81.62.33.8 1.12 2.75 1.22 2.95.1.2.16.44.03.67-.13.23-.2.38-.4.58-.2.2-.42.45-.6.6-.2.17-.41.35-.18.68.23.34 1.02 1.7 2.19 2.75 1.51 1.35 2.78 1.77 3.17 1.97.39.2.62.17.85-.1.23-.27.98-1.15 1.24-1.54.26-.39.52-.33.86-.2.34.12 2.16 1.02 2.53 1.2.37.18.62.27.71.42.1.15.1.88-.23 1.81Z"
                      />
                    </svg>
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-8 h-8 text-white hover:bg-white/20"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Chat Content */}
          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[420px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          }`}
                      >
                        {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Suggestions */}
                {messages.length > 0 && messages[messages.length - 1].suggestions && !isTyping && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 px-2">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors text-xs"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Powered by Nadjam AI • Available 24/7</p>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  )
}
