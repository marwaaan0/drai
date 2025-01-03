import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/providers/AuthProvider'
import { supabase } from '@/lib/supabase'

export function UserMenu() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      setIsUploading(true)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      if (metadataError) throw metadataError

    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (!user) return null

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-[4px] bg-transparent hover:bg-zinc-800/30 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt={user.user_metadata?.name || 'User avatar'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-zinc-400">
              {(user.user_metadata?.name || 'U').charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-1 w-64 rounded-[4px] bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden"
          >
            <div className="px-3 py-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {user?.user_metadata?.name || 'User'}
                </span>
                <span className="text-xs text-zinc-400">{user?.email}</span>
              </div>
            </div>

            <div className="border-t border-zinc-800">
              <button
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.onchange = handleAvatarUpload
                  input.click()
                }}
                disabled={isUploading}
                className="w-full px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800/50 transition-colors text-left flex items-center gap-2"
              >
                <span className="relative">
                  {isUploading ? 'Uploading...' : 'Change Avatar'}
                  {isUploading && (
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-3 h-3 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />
                    </motion.div>
                  )}
                </span>
              </button>
              <button
                onClick={handleSignOut}
                className="w-full px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800/50 transition-colors text-left"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
