import { useState, useRef, useEffect } from 'react'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import { motion, AnimatePresence } from 'framer-motion'
import { API_ENDPOINTS } from '@/config/api'
import { MessageActions } from '@/components/MessageActions'
import { useAuth } from '@/providers/AuthProvider'
import { UserMenu } from '@/components/UserMenu'

interface Message {
  role: 'user' | 'assistant'
  content: string
  id: string
}

export function ChatPage() {
  const { signOut, user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { 
      role: 'user', 
      content: input,
      id: Date.now().toString() 
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(API_ENDPOINTS.chat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          context: messages
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response,
        id: Date.now().toString()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        id: Date.now().toString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-[#0D0D0D]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.header 
        className="flex items-center justify-between px-8 py-5 bg-[#0D0D0D]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h1 
          className="text-2xl font-semibold text-white/90 tracking-tight"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Draxen
        </motion.h1>
        <UserMenu />
      </motion.header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="relative h-[calc(100vh-180px)] flex items-center justify-center overflow-hidden">
            {/* Background animation circles */}
            <motion.div
              className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.2, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-6 text-center px-4 w-full max-w-2xl mx-auto relative z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.5
                }}
                className="relative"
              >
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg blur"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.3, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.h2 
                  className="text-4xl font-semibold text-white/90 relative"
                  animate={{
                    y: [0, -4, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Welcome to Draxen AI, {user?.user_metadata?.name}! 
                  <motion.span
                    animate={{
                      rotate: [0, 20, 0],
                      y: [0, -4, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block ml-2"
                  >
                    👋
                  </motion.span>
                </motion.h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-lg text-zinc-400 max-w-md relative"
              >
                I'm your AI assistant, ready to help you with anything you need. Feel free to ask me any questions!
              </motion.p>
            </motion.div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto px-4 py-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <AnimatePresence mode="sync">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: {
                        duration: 0.2,
                        delay: message.role === 'assistant' ? 0.1 : 0,
                        ease: "easeOut"
                      }
                    }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.1 } }}
                    className={`flex items-start gap-2 ${message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Avatar */}
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 flex items-center justify-center">
                        {user?.user_metadata?.avatar_url ? (
                          <img 
                            src={user.user_metadata.avatar_url} 
                            alt={user?.user_metadata?.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-zinc-400">
                            {user?.user_metadata?.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    )}
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 flex items-center justify-center">
                        <span className="text-sm font-medium text-zinc-400">D</span>
                      </div>
                    )}

                    {/* Message */}
                    <motion.div 
                      className={`
                        relative group max-w-[85%] min-w-[100px] min-h-[60px] rounded-2xl px-4 py-3
                        ${message.role === 'assistant' 
                          ? 'bg-[#1A1A1A] text-white/90' 
                          : 'bg-[#2A2A2A] text-white/90'
                        }
                      `}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="pb-8">
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <MessageActions content={message.content} messageId={message.id} />
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      duration: 0.2,
                      ease: "easeOut"
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.95, 
                    transition: { 
                      duration: 0.1,
                      ease: "easeIn"
                    } 
                  }}
                  className="flex justify-start"
                >
                  <motion.div 
                    className="bg-[#1A1A1A] rounded-2xl px-4 py-2 text-white/90"
                    animate={{ 
                      y: [0, -3, 0],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-white/10">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-4">
          <motion.div 
            className="relative rounded-2xl bg-[#1A1A1A] shadow-lg ring-0 focus-within:ring-0 focus-within:outline-none"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message Draxen..."
              className="w-full py-2.5 px-4 pr-16 bg-transparent text-white/90 placeholder-white/30 text-sm resize-none outline-none focus:outline-none focus:ring-0 ring-0 border-none focus:border-none min-h-[40px] max-h-[200px]"
              style={{ outline: 'none', boxShadow: 'none' }}
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              className="absolute right-2 bottom-2 p-1.5 text-white/50 hover:text-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!input.trim() || isLoading}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="w-5 h-5"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M2 12l7-7v4c11.953 0 11.953 12 11.953 12-1.995-2.858-4.993-4-7.953-4v4l-7-7" 
                />
              </svg>
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}
