
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "Is TranscriptGenie completely free?",
      answer: "Yes! TranscriptGenie is 100% free to use. You can generate unlimited transcripts without any cost, registration, or hidden fees. We believe in providing accessible tools for everyone."
    },
    {
      question: "Do I need to create an account?",
      answer: "No account required! Simply paste your YouTube URL and get your transcript instantly. We don't collect personal information or require any sign-up process."
    },
    {
      question: "Does it work with private YouTube videos?",
      answer: "TranscriptGenie works with publicly available YouTube videos. Private videos, unlisted videos, or videos with restricted access cannot be processed as we cannot access their content."
    },
    {
      question: "How accurate are the transcripts?",
      answer: "Our AI-powered transcription achieves 90-95% accuracy for clear audio. Accuracy may vary based on audio quality, accents, background noise, and speaking clarity. We continuously improve our algorithms for better results."
    },
    {
      question: "What file formats can I download?",
      answer: "You can download transcripts in TXT and PDF formats, or copy the text directly to your clipboard. We're working on adding more formats like DOCX and SRT subtitles."
    },
    {
      question: "Is there a limit on video length?",
      answer: "Currently, we support videos up to 2 hours in length. For longer videos, we recommend breaking them into shorter segments. Most educational and business content falls well within this limit."
    },
    {
      question: "What languages are supported?",
      answer: "We support over 50 languages including English, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean, Arabic, and many more. The tool automatically detects the video's language."
    },
    {
      question: "Do you store my videos or transcripts?",
      answer: "No, we prioritize your privacy. We don't store videos, transcripts, or any personal data. All processing happens in real-time, and data is immediately deleted after processing."
    },
    {
      question: "Can I use this for commercial purposes?",
      answer: "Yes! You can use TranscriptGenie for personal, educational, or commercial purposes. However, please ensure you have the right to transcribe the content and respect copyright laws."
    },
    {
      question: "What if the transcript has errors?",
      answer: "While our AI is highly accurate, you can easily edit the transcript text before downloading. We recommend reviewing the output, especially for important documents or professional use."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about TranscriptGenie
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white dark:bg-gray-800 rounded-2xl border shadow-sm px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help!
            </p>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-primary hover:text-primary/80 font-medium underline"
            >
              Contact our support team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
