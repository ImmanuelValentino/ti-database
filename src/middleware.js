import { NextResponse } from 'next/server';

// Definisikan headers CORS di sini
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

export function middleware(request) {
    // 1. Langsung tangani preflight request (OPTIONS)
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    // 2. Jalankan pengecekan API Key untuk path API
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const apiKey = request.headers.get('x-api-key');
        const validApiKeys = process.env.VALID_API_KEYS?.split(',');

        if (!validApiKeys || !validApiKeys.includes(apiKey)) {
            // 3. Kembalikan error DENGAN CORS headers
            return new NextResponse(
                JSON.stringify({ message: 'Unauthorized' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }
    }

    // Jika semua pengecekan lolos, lanjutkan
    return NextResponse.next();
}