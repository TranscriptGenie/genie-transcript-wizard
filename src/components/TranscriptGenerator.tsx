import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Youtube, Download, Copy, FileText, CheckCircle, AlertCircle, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const TranscriptGenerator: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const extractVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      
      // Handle youtube.com URLs
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      }
      
      // Handle youtu.be URLs
      if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
      
      return null;
    } catch {
      return null;
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      toast.error('Please sign in to generate transcripts');
      navigate('/auth');
      return;
    }

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Could not extract video ID from URL');
      return;
    }

    setError('');
    setIsLoading(true);
    setTranscript('');

    try {
      console.log('Calling YouTube transcript function for video ID:', videoId);
      
      const { data, error } = await supabase.functions.invoke('youtube-transcript', {
        body: { videoId }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setTitle(data.title || `YouTube Video - ${videoId}`);
      setTranscript(data.transcript);
      toast.success('Transcript generated successfully!');
      
    } catch (err: any) {
      console.error('Error fetching transcript:', err);
      
      let errorMessage = 'Failed to generate transcript. ';
      
      if (err.message) {
        if (err.message.includes('captions') || err.message.includes('subtitles')) {
          errorMessage += 'This video may not have captions available or they may be disabled.';
        } else if (err.message.includes('private') || err.message.includes('not found')) {
          errorMessage += 'This video may be private or unavailable.';
        } else if (err.message.includes('restricted')) {
          errorMessage += 'This video has restricted access to its subtitles.';
        } else {
          errorMessage += err.message;
        }
      } else {
        errorMessage += 'Please check the URL and try again.';
      }
      
      setError(errorMessage);
      toast.error('Failed to generate transcript');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !transcript) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('transcripts')
        .insert({
          user_id: user.id,
          video_url: url,
          title: title || `YouTube Video - ${extractVideoId(url)}`,
          transcript: transcript,
        });

      if (error) throw error;

      toast.success('Transcript saved successfully!');
    } catch (error) {
      console.error('Error saving transcript:', error);
      toast.error('Failed to save transcript');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    if (transcript) {
      await navigator.clipboard.writeText(transcript);
      toast.success('Transcript copied to clipboard!');
    }
  };

  const handleDownload = (format: 'txt' | 'pdf') => {
    if (!transcript) return;

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Transcript downloaded as ${format.toUpperCase()}!`);
  };

  return (
    <section id="generator" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Generate Your Transcript</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Paste any YouTube URL below and get your transcript in seconds
            </p>
            {!user && (
              <p className="text-sm text-orange-600 mt-2">
                Please sign in to generate and save transcripts
              </p>
            )}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-600" />
                YouTube URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !url.trim()}
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-8"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Transcript'
                  )}
                </Button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {isLoading && (
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Fetching transcript from YouTube API...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {transcript && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Generated Transcript
                  </CardTitle>
                  <div className="flex gap-2">
                    {user && (
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        variant="default"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save
                      </Button>
                    )}
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      onClick={() => handleDownload('txt')}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      TXT
                    </Button>
                    <Button
                      onClick={() => handleDownload('pdf')}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={transcript}
                  readOnly
                  className="min-h-[400px] font-mono text-sm leading-relaxed"
                  placeholder="Your transcript will appear here..."
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  Word count: {transcript.split(' ').length} words • 
                  Character count: {transcript.length} characters
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Try with these example URLs:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'https://youtu.be/dQw4w9WgXcQ',
                'https://www.youtube.com/watch?v=9bZkp7q19f0'
              ].map((exampleUrl, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setUrl(exampleUrl)}
                  className="text-xs"
                  disabled={isLoading}
                >
                  Example {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TranscriptGenerator;
