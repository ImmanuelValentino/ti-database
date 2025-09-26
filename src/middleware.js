import { NextResponse } from 'next/server';

export function middleware(request) {
    // Kita hanya ingin middleware ini berjalan untuk path API
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const apiKey = request.headers.get('x-api-key');

        // Ambil daftar kunci yang valid dari Vercel Environment Variables
        const validApiKeys = process.env.VALID_API_KEYS?.split(',');

        // Jika tidak ada daftar kunci atau kunci yang diberikan tidak valid
        if (!validApiKeys || !validApiKeys.includes(apiKey)) {
            // Tolak permintaan
            return new NextResponse(
                JSON.stringify({ message: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    // Jika kunci valid, lanjutkan permintaan
    return NextResponse.next();
}