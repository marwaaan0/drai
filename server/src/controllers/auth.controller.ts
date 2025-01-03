import { Request, Response } from 'express'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body

    // Create auth user first
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name // Store name in user metadata
        }
      }
    })

    if (signUpError) {
      console.error('Signup error:', signUpError)
      return res.status(400).json({ message: signUpError.message })
    }

    if (!authData.user) {
      return res.status(400).json({ message: 'Failed to create user' })
    }

    // Create profile using admin client to bypass RLS
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert([
        {
          id: authData.user.id,
          name,
          updated_at: new Date().toISOString(),
        },
      ])

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Cleanup: delete auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return res.status(500).json({ message: 'Error creating user profile' })
    }

    const token = jwt.sign(
      { userId: authData.user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: authData.user.id,
        email: email,
        name: name,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ message: 'Error creating user' })
  }
}

export async function signin(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      console.error('Signin error:', signInError)
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    if (!authData.user) {
      return res.status(400).json({ message: 'User not found' })
    }

    // Get profile data using admin client to bypass RLS
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return res.status(500).json({ message: 'Error fetching user data' })
    }

    // If profile doesn't exist, create it from auth data
    if (!profileData) {
      const { error: createProfileError } = await supabaseAdmin
        .from('profiles')
        .upsert([
          {
            id: authData.user.id,
            name: authData.user.user_metadata?.name || email.split('@')[0],
            updated_at: new Date().toISOString(),
          },
        ])

      if (createProfileError) {
        console.error('Profile creation error:', createProfileError)
        return res.status(500).json({ message: 'Error creating user profile' })
      }
    }

    const token = jwt.sign(
      { userId: authData.user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: profileData?.name || authData.user.user_metadata?.name || email.split('@')[0],
      },
    })
  } catch (error) {
    console.error('Signin error:', error)
    res.status(500).json({ message: 'Error signing in' })
  }
}
