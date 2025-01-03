-- Add avatar_url column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update policies to allow users to update their avatar
CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR ALL USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('avatars', 'avatars')
ON CONFLICT DO NOTHING;
