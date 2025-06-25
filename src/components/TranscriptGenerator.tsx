
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Youtube, Download, Copy, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TranscriptGenerator: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const mockTranscript = `Welcome to our comprehensive guide on React development! In this video, we'll explore the fundamental concepts that every developer should master.

First, let's talk about components. React components are the building blocks of any React application. They allow you to split the UI into independent, reusable pieces, and think about each piece in isolation.

There are two main types of components in React: functional components and class components. Functional components are simpler and are the preferred way to create components in modern React development.

Props are how components communicate with each other. They're read-only and help you pass data from parent to child components. Think of props as function arguments – they're inputs to your component.

State management is crucial for building interactive applications. The useState hook allows functional components to have state. When state changes, React re-renders the component to reflect those changes.

Effects in React handle side effects in your components. The useEffect hook lets you perform data fetching, subscriptions, or manually changing the DOM from React components.

Remember to always keep your components small and focused on a single responsibility. This makes your code more maintainable and easier to test.

Thank you for watching this tutorial! Don't forget to subscribe for more React content and hit the notification bell to stay updated with our latest videos.`;

  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setError('');
    setIsLoading(true);
    setTranscript('');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setTranscript(mockTranscript);
      toast.success('Transcript generated successfully!');
    } catch (err) {
      setError('Failed to generate transcript. Please try again.');
      toast.error('Failed to generate transcript');
    } finally {
      setIsLoading(false);
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
          </div>

          {/* Input Section */}
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
                  <span className="text-sm">Processing video and generating transcript...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Section */}
          {transcript && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Generated Transcript
                  </CardTitle>
                  <div className="flex gap-2">
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

          {/* Example URLs */}
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
