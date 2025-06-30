
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface YoutubeTranscriptRequest {
  videoId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { videoId }: YoutubeTranscriptRequest = await req.json()
    
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Video ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY')
    
    if (!youtubeApiKey) {
      return new Response(
        JSON.stringify({ error: 'YouTube API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Fetching video details for:', videoId)

    // Get video details first
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`
    )

    if (!videoResponse.ok) {
      throw new Error(`YouTube API error: ${videoResponse.status}`)
    }

    const videoData = await videoResponse.json()
    
    if (!videoData.items || videoData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Video not found or is private' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const videoTitle = videoData.items[0].snippet.title

    // Get captions list
    const captionsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${youtubeApiKey}`
    )

    if (!captionsResponse.ok) {
      throw new Error(`Captions API error: ${captionsResponse.status}`)
    }

    const captionsData = await captionsResponse.json()
    
    if (!captionsData.items || captionsData.items.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No captions available for this video. The video may not have subtitles or they may be disabled.' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Find the best caption track (prefer auto-generated English)
    let captionId = null
    const englishCaptions = captionsData.items.find((item: any) => 
      item.snippet.language === 'en' || item.snippet.language === 'en-US'
    )
    
    if (englishCaptions) {
      captionId = englishCaptions.id
    } else if (captionsData.items.length > 0) {
      captionId = captionsData.items[0].id
    }

    if (!captionId) {
      return new Response(
        JSON.stringify({ error: 'No suitable captions found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Downloading caption track:', captionId)

    // Download the caption content
    const captionResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions/${captionId}?key=${youtubeApiKey}`,
      {
        headers: {
          'Authorization': `Bearer ${youtubeApiKey}`
        }
      }
    )

    if (!captionResponse.ok) {
      // Fall back to a simple method - this might not work for all videos
      // but we'll return what we can
      return new Response(
        JSON.stringify({ 
          error: 'Could not download captions. This video may have restricted access to its subtitles.' 
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const captionText = await captionResponse.text()
    
    // Basic cleanup of caption text (remove timestamps, etc.)
    const cleanText = captionText
      .replace(/<[^>]*>/g, '') // Remove XML/HTML tags
      .replace(/\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}/g, '') // Remove timestamps
      .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
      .trim()

    return new Response(
      JSON.stringify({ 
        transcript: cleanText || 'Transcript content could not be extracted',
        title: videoTitle 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error: any) {
    console.error('Error fetching YouTube transcript:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch transcript'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
