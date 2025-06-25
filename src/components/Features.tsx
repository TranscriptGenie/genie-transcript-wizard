
import React from 'react';
import { Zap, Shield, Download, Clock, Users, Globe } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get your transcript in under 30 seconds. Our advanced AI processes videos quickly and accurately.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Shield,
      title: 'No Login Required',
      description: 'Start transcribing immediately. No sign-ups, no passwords, no personal information needed.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Download,
      title: 'Multiple Formats',
      description: 'Export your transcripts as TXT, PDF, or copy to clipboard. Choose the format that works for you.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Our service is always online and ready to help. Generate transcripts anytime, anywhere.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Users,
      title: 'Privacy First',
      description: 'We don\'t store your videos or transcripts. Everything is processed securely and deleted immediately.',
      color: 'from-indigo-400 to-purple-500'
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'Support for 50+ languages. Transcribe videos in English, Spanish, French, and many more.',
      color: 'from-rose-400 to-red-500'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="text-gradient">TranscriptGenie</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the fastest, most accurate, and user-friendly YouTube transcript generator available today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Paste YouTube URL</h4>
              <p className="text-muted-foreground">Copy the link of any YouTube video and paste it into our input field</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Click Generate</h4>
              <p className="text-muted-foreground">Our AI processes the video and creates an accurate transcript in seconds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download & Use</h4>
              <p className="text-muted-foreground">Export your transcript in your preferred format and use it however you need</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
