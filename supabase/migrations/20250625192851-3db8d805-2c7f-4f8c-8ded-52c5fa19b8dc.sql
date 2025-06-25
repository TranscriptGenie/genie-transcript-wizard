
-- Create transcripts table to store user transcripts
CREATE TABLE public.transcripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_url TEXT NOT NULL,
  title TEXT,
  transcript TEXT NOT NULL,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;

-- Create policies for transcripts table
CREATE POLICY "Users can view their own transcripts" 
  ON public.transcripts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transcripts" 
  ON public.transcripts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transcripts" 
  ON public.transcripts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transcripts" 
  ON public.transcripts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_transcripts_updated_at 
  BEFORE UPDATE ON public.transcripts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
