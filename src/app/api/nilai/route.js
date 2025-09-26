import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

// Definisikan headers CORS yang lengkap
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

// Fungsi untuk menangani Preflight Request
export async function OPTIONS(request) {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// Skema Zod untuk POST (membuat data nilai baru)
const NilaiSchema = z.object({
    nim: z.string().regex(/^[0-9]+$/, "NIM harus berupa string angka"),
    kode_mk: z.string().min(1, { message: "Kode Mata Kuliah tidak boleh kosong" }),
    nilai: z.number().int().min(0, "Nilai minimal 0").max(100, "Nilai maksimal 100"),
});

// GET semua nilai (dengan join mahasiswa + mata kuliah)
export async function GET() {
    const { data, error } = await supabase
        .from("nilai")
        .select("id, nilai, mahasiswa(nim, nama), mata_kuliah(kode_mk, nama_mk)");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
    return NextResponse.json(data, { headers: corsHeaders });
}

// POST tambah nilai
export async function POST(req) {
    try {
        const body = await req.json();
        const validatedData = NilaiSchema.parse(body);

        const { data, error } = await supabase
            .from("nilai")
            .insert([validatedData])
            .select()
            .single();

        if (error) {
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