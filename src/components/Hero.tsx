import React from 'react';
import { ArrowRight, Play, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface HeroProps {
  onGetStarted: () => void;
}
const Hero: React.FC<HeroProps> = ({
  onGetStarted
}) => {
  return <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-8">
            <Youtube className="h-4 w-4 mr-2" />
            Free YouTube Transcript Generator
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Turn YouTube Videos into{' '}
            <span className="text-gradient">Text Instantly</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Paste a YouTube link and get a clean, accurate transcript in seconds. 
            No login required, completely free forever.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button onClick={onGetStarted} size="lg" className=" hover:from-purple-700 hover:to-cyan-600 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 px-[80px] text-gray-50 bg-sky-500 hover:bg-sky-400">
              Generate Transcript
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-accent">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Preview Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border">
              <div className="bg-red-100 dark:bg-red-900/20 rounded-lg p-4 mb-4">
                <Youtube className="h-8 w-8 text-red-600 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2">Paste YouTube URL</h3>
              <p className="text-sm text-muted-foreground">
                Copy any YouTube video link and paste it into our generator
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border">
              <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-4 mb-4">
                <div className="h-8 w-8 bg-green-600 rounded mx-auto flex items-center justify-center text-white font-bold">
                  T
                </div>
              </div>
              <h3 className="font-semibold mb-2">Get Clean Transcript</h3>
              <p className="text-sm text-muted-foreground">
                Download formatted text in TXT or PDF format instantly
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-16 text-muted-foreground">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-sm">Free Forever</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-sm">Registration Required</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">⚡</div>
              <div className="text-sm">Lightning Fast</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;