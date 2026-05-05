// app/api/ai/chat/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/app/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: Request) {
    try {
    const { message } = await req.json();

    // Obtener recitales actuales para contexto
    const upcomingRecitals = await prisma.recital.findMany({
        where: { 
        date: { gte: new Date() } 
        },
        take: 5,
        include: { 
        artist: true, 
        venue: true 
        },
        orderBy: { date: 'asc' }
    });

    // Contexto para el bot
    const systemContext = `Eres RecitalBot, asistente virtual de Recitaly🎵

INFORMACIÓN ACTUAL:
Próximos recitales disponibles:
${upcomingRecitals.map(r => 
    `- ${r.artist.name} en ${r.venue.name}
    📅 ${new Date(r.date).toLocaleDateString('es-AR')}
    💰 $${r.price}
    📍 ${r.venue.name}`
).join('\n')}

PUEDES AYUDAR CON:
✅ Información sobre recitales y artistas
✅ Precios y fechas disponibles  
✅ Recomendaciones musicales
✅ Proceso de compra de entradas
✅ Ubicaciones de venues
✅ Políticas de cancelación

INSTRUCCIONES:
- Responde en ingles de forma amigable y concisa
- Usa emojis para hacer más visual la respuesta
- Si no sabes algo específico, sugiere contactar soporte
- Menciona siempre Recitaly como nuestra plataforma
- Máximo 200 palabras por respuesta

Pregunta del usuario: ${message}`;

    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(systemContext);
    const response = await result.response;
    
    return NextResponse.json({ 
        response: response.text() 
    });

    } catch (error: any) {
  console.error('❌ Error in chatbot:', error?.message, error?.response?.data);
 
    return NextResponse.json(
        { 
        response: 'Im sorry, there was an error processing your request. Please try again later.'
        },
        { status: 500 }
    );
    }
}