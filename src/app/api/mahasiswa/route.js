import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

// Definisikan headers CORS di satu tempat agar mudah digunakan
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const MahasiswaSchema = z.object({
    nim: z.string().regex(/^[0-9]+$/, "NIM harus berupa string angka"),
    nama: z.string().min(1, { message: "Nama tidak boleh kosong" }),
    jurusan: z.string().min(1, { message: "Jurusan tidak boleh kosong" }),
});

// GET semua mahasiswa
export async function GET() {
    const { data, error } = await supabase.from("mahasiswa").select("*");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
    // Pastikan headers ada di respons sukses
    return NextResponse.json(data, { headers: corsHeaders });
}

// Tambah mahasiswa baru DENGAN VALIDASI & CORS
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
            if (error.code === '23505') {
                return NextResponse.json({ error: "NIM sudah terdaftar." }, { status: 409, headers: corsHeaders });
            }
            return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
        }

        // Pastikan headers ada di respons sukses
        return NextResponse.json(data, { status: 201, headers: corsHeaders });

    } catch (error) {
        if (error instanceof z.ZodError) {
            // Pastikan headers ada di respons error validasi
            return NextResponse.json({ error: error.issues }, { status: 400, headers: corsHeaders });
        }
        // Pastikan headers ada di respons error lainnya
        return NextResponse.json({ error: "Request body tidak valid" }, { status: 400, headers: corsHeaders });
    }
}