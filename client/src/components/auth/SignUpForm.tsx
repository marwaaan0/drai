import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/providers/AuthProvider'
import { UserPlus, Mail, Lock, User } from 'lucide-react'

export function SignUpForm() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const name = formData.get('name') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await signUp({ email, password, name })
      
      if (error) {
        if (error.message?.includes('rate limit')) {
          setError('Please wait a moment while we complete your signup...')
          return
        }
        throw error
      }

      navigate('/auth/verify-email', { 
        state: { email },
        replace: true 
      })
    } catch (err) {
      console.error('Signup error:', err)
      if (err instanceof Error) {
        setError(err.message.includes('rate limit') 
          ? 'Too many attempts. Please try again in a few minutes.'
          : err.message)
      } else {
        setError('An error occurred during signup')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#111827] p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-8">
          {/* Icon Animation Container */}
          <div className="relative w-32 h-32 mx-auto">
            {/* Glowing background */}
            <motion.div
              className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Icon Base with 3D effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg transform-gpu"
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2 
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <UserPlus className="w-16 h-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
              </motion.div>
            </motion.div>

            {/* Animated Rings */}
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="absolute inset-0 border-2 border-blue-400 rounded-2xl"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: [1, 1.5, 1.8],
                  opacity: [0.5, 0.2, 0],
                  rotate: [0, 45, 90]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.4,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Title */}
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Create Account
          </motion.h1>

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              {/* Name Input */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative group"
              >
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5 transition-colors group-hover:text-blue-400" />
                <motion.input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 rounded-xl outline-none text-white placeholder-zinc-400 transition-all duration-300 hover:border-blue-400/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                />
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative group"
              >
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5 transition-colors group-hover:text-blue-400" />
                <motion.input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 rounded-xl outline-none text-white placeholder-zinc-400 transition-all duration-300 hover:border-blue-400/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                />
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="relative group"
              >
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5 transition-colors group-hover:text-blue-400" />
                <motion.input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 rounded-xl outline-none text-white placeholder-zinc-400 transition-all duration-300 hover:border-blue-400/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                />
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="relative group"
              >
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5 transition-colors group-hover:text-blue-400" />
                <motion.input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 rounded-xl outline-none text-white placeholder-zinc-400 transition-all duration-300 hover:border-blue-400/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                />
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-4 px-6 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-xl font-medium overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ 
                backgroundPosition: ['0%', '50%', '100%'],
                transition: { 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "linear"
                }}
              />
              
              {/* Button content */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <motion.div 
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </>
                )}
              </span>
            </motion.button>

            {/* Sign In Link */}
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-zinc-400">
                Already have an account?{' '}
                <a href="/auth/signin" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                  Sign in
                </a>
              </p>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  )
}
