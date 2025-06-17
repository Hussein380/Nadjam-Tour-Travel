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

const initialBotMessage: Message = {
  id: "1",
  type: "bot",
  content: "Hello! I'm Nadjam AI, your personal travel assistant. How can I help you plan your perfect trip today?",
  timestamp: new Date(),
  suggestions: quickSuggestions,
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([initialBotMessage])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()

    let response = ""
    let suggestions: string[] = []

    if (lowerMessage.includes("hotel") || lowerMessage.includes("accommodation")) {
      response =
        "I'd be happy to help you find the perfect hotel! 🏨 We have amazing properties across Kenya including luxury safari lodges, beach resorts, and city hotels. Which destination are you interested in?"
      suggestions = ["Nairobi hotels", "Mombasa beach resorts", "Maasai Mara lodges", "Show all hotels"]
    } else if (lowerMessage.includes("flight") || lowerMessage.includes("fly")) {
      response =
        "Great choice! ✈️ We offer flights to amazing destinations worldwide. Our popular routes include Dubai, Istanbul, London, and Paris. Where would you like to fly to?"
      suggestions = ["Nairobi to Dubai", "Mombasa to Istanbul", "Flight deals", "All destinations"]
    } else if (lowerMessage.includes("safari") || lowerMessage.includes("package")) {
      response =
        "Safari adventures are our specialty! 🦁 We offer incredible packages including the Great Migration, Big Five safaris, and luxury eco-lodges. What type of experience are you looking for?"
      suggestions = ["Kenya Safari", "Tanzania Safari", "Luxury packages", "Budget packages"]
    } else if (lowerMessage.includes("hajj") || lowerMessage.includes("umrah")) {
      response =
        "We provide comprehensive Hajj & Umrah services with experienced guides and comfortable accommodations. 🕌 Our packages include flights, visas, hotels, and spiritual guidance. Would you like to know more?"
      suggestions = ["Hajj packages", "Umrah packages", "Package details", "Booking process"]
    } else if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("deal")) {
      response =
        "We offer competitive prices and exclusive deals! 💰 Our packages start from $1,299 and we have special discounts up to 25% off. What type of trip are you planning?"
      suggestions = ["Budget packages", "Luxury deals", "Group discounts", "Special offers"]
    } else if (lowerMessage.includes("contact") || lowerMessage.includes("phone") || lowerMessage.includes("call")) {
      response =
        "You can reach us anytime! 📞 Call us at +254 706 686 349 or +254 729 884 108, email info@nadjamtravel.co.ke, or visit our office at 7th Street, Eastleigh, Nairobi."
      suggestions = ["Call now", "Send email", "WhatsApp us", "Office location"]
    } else {
      response =
        "Thank you for your message! I'm here to help you with hotels, flights, safari packages, Hajj & Umrah services, and any travel planning needs. What would you like to explore?"
      suggestions = quickSuggestions
    }

    return {
      id: Date.now().toString(),
      type: "bot",
      content: response,
      timestamp: new Date(),
      suggestions,
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse = generateBotResponse(message)
        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
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

  return (
    <>
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
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        }`}
                      >
                        {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
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
