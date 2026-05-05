import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { saveTicketmasterEvent } from '@/app/lib/utils';
import { ExternalServiceError } from "@/app/lib/errors";


export async function POST(req: NextRequest) {
  // Verificar variables de entorno
  if (!process.env.TICKETMASTER_API_KEY) {
    throw new ExternalServiceError('Ticketmaster API key not configured');
  }

  try {
    const { searchParams } = new URL(req.url);
    const count = Number(searchParams.get('count')) || 10;
    const from = searchParams.get('from') || new Date().toISOString().split('T')[0];
    const to = searchParams.get('to') || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
    const keyword = searchParams.get('keyword') || '';
    const artist = searchParams.get('artist') || '';

    

    // Validar parámetros
    if (count < 1 || count > 100) {
      throw new Error('Count must be between 1 and 100');
    }
    let page = 0
  let savedCount = 0;
    let errorCount = 0;
    while(page < 10) {
      // Build Ticketmaster API URL
      console.log(`page: ${page}`);
      let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=${count}&segmentName=Music&page=${page}&apikey=${process.env.TICKETMASTER_API_KEY}`;
      if (from) url += `&startDateTime=${from}T00:00:00Z`;
      if (to) url += `&endDateTime=${to}T23:59:59Z`;
      const keywords: string[] = [];
      if (keyword) keywords.push(keyword);
      if (artist) keywords.push(artist);

      if (keywords.length > 0) {
        url += `&keyword=${encodeURIComponent(keywords.join(' '))}`;
      }
      const tmRes = await fetch(url);
      
      if (!tmRes.ok) {
        if (tmRes.status === 401) {
          throw new ExternalServiceError('Ticketmaster API authentication failed');
        }
        if (tmRes.status === 429) {
          throw new ExternalServiceError('Ticketmaster API rate limit exceeded');
        }
        throw new ExternalServiceError(`Ticketmaster API error: ${tmRes.status}`);
      }

      const tmData = await tmRes.json();
      const events = tmData._embedded?.events || [];

      if (savedCount ==0 && events.length === 0) {
        return Response.json({ message: 'No events found for the specified criteria' });
      }

      

      for (const event of events) {
        try {
          const success = await saveTicketmasterEvent(event);
          if (success) savedCount++;
          if (savedCount >= count) break; // Stop if we reached the desired count
        } catch (error) {
          console.error(`Failed to save event ${event.id}:`, error);
          errorCount++;
        }
      }

      if(savedCount >= count){return Response.json({ 
        message: `${savedCount} music events added successfully!`,
        ...(errorCount > 0 && { warnings: `${errorCount} events failed to save` })
      });}  
      page++;
    
  }
  return Response.json({ 
      message: `${count*10} events found that were already in database, ${savedCount} music events added successfully!`,
      ...(errorCount > 0 && { warnings: `${errorCount} events failed to save` })
    });
  } catch (error: any) {
    console.error('Ticketmaster API Error:', error);
    
    // Re-throw como ExternalServiceError si no es ya uno
    if (!(error instanceof ExternalServiceError)) {
      throw new ExternalServiceError(`Ticketmaster service error: ${error.message}`);
    }
    
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}