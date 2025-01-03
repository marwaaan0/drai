import { Routes, Route, Navigate } from 'react-router-dom'
import { SignInPage } from './pages/auth/SignInPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ChatPage } from './pages/ChatPage'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'

export function App() {
  return (
    <Theme appearance="dark" accentColor="iris">
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        <Route path="/auth/signin" element={<SignInPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Theme>
  )
}
