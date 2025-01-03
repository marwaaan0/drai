import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail } from 'lucide-react'

export function VerifyEmailPage() {
  const location = useLocation()
  const email = (location.state as { email?: string })?.email

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#111827] p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-8 text-center">
          {/* Email Animation Container */}
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

            {/* Envelope Base with 3D effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg transform-gpu"
              initial={{ scale: 0, rotateY: -180, rotateX: -45 }}
              animate={{ scale: 1, rotateY: 0, rotateX: 0 }}
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
                <Mail className="w-16 h-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
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

            {/* Floating particles */}
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={`particle-${index}`}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  opacity: 0 
                }}
                animate={{ 
                  x: [0, (index % 2 ? 50 : -50) * Math.random()],
                  y: [-40 * Math.random()],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                style={{
                  left: '50%',
                  top: '50%'
                }}
              />
            ))}
          </div>

          {/* Title with gradient */}
          <motion.h1 
            className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Check your inbox
          </motion.h1>

          {/* Description */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-lg text-zinc-300">
              We've sent a verification link to
            </p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="inline-block"
            >
              <p className="text-xl font-medium text-white bg-gradient-to-r from-blue-500/10 to-blue-600/10 py-3 px-6 rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/5">
                {email}
              </p>
            </motion.div>
            <p className="text-zinc-300">
              Click the link in the email to verify your account and get started.
            </p>
          </motion.div>

          {/* Additional Info */}
          <motion.div 
            className="pt-6 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-zinc-400">
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                resend verification email
              </button>
            </p>

            <div className="flex justify-center space-x-6">
              <Link
                to="/auth/signin"
                className="text-zinc-400 hover:text-blue-400 transition-colors text-sm"
              >
                Back to sign in
              </Link>
              <span className="text-zinc-700">•</span>
              <Link
                to="/auth/signup"
                className="text-zinc-400 hover:text-blue-400 transition-colors text-sm"
              >
                Try another email
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
