import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

// Definisikan headers CORS yang lengkap
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

// Fungsi untuk menangani Preflight Request
export async function OPTIONS(request) {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// Skema Zod untuk POST (membuat data baru)
const MahasiswaSchema = z.object({
    nim: z.string().regex(/^[0-9]+$/, "NIM harus berupa string angka"),
    nama: z.string().min(1, { message: "Nama tidak boleh kosong" }),
    jurusan: z.string().min(1, { message: "Jurusan tidak boleh kosong" }),
});

// GET semua mahasiswa DENGAN PAGINATION
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Kalkulasi untuk range Supabase
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Ambil data dan total hitungan
    const { data, error, count } = await supabase
        .from("mahasiswa")
        .select("*", { count: 'exact' }) // Minta total data
        .range(from, to); // Ambil hanya data untuk halaman ini

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }

    // Kembalikan data beserta informasi pagination
    return NextResponse.json({
        data,
        count,
        page,
        limit
    }, { headers: corsHeaders });
}

// POST tambah mahasiswa baru
export async function POST(req) {
    try {
        const body = await req.json();
        const validatedData = MahasiswaSchema.parse(body);

        const { data, error } = await supabase
            .from("mahasiswa")
            .insert([validatedData])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Error untuk duplikat unique key
                return NextResponse.json({ error: "NIM sudah terdaftar." }, { status: 409, headers: corsHeaders });
            }
            return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
        }

        return NextResponse.json(data, { status: 201, headers: corsHeaders });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400, headers: corsHeaders });
        }
        return NextResponse.json({ error: "Request body tidak valid atau bukan JSON" }, { status: 400, headers: corsHeaders });
    }
}