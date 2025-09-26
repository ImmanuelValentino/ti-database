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

// Skema Zod untuk PUT (update), semua field opsional
const UpdateMahasiswaSchema = z.object({
    nama: z.string().min(1, { message: "Nama tidak boleh kosong" }).optional(),
    jurusan: z.string().min(1, { message: "Jurusan tidak boleh kosong" }).optional(),
})
    .refine(data => Object.keys(data).length > 0, {
        message: "Request body tidak boleh kosong.",
    });

// GET mahasiswa by NIM
export async function GET(req, { params }) {
    const { nim } = params;
    const { data, error } = await supabase.from("mahasiswa").select("*").eq("nim", nim).single();

    if (error) {
        return NextResponse.json({ error: "Mahasiswa tidak ditemukan" }, { status: 404, headers: corsHeaders });
    }
    return NextResponse.json(data, { headers: corsHeaders });
}

// PUT (Update) mahasiswa by NIM
export async function PUT(req, { params }) {
    try {
        const { nim } = params;
        const body = await req.json();
        const validatedData = UpdateMahasiswaSchema.parse(body);

        const { data, error } = await supabase.from("mahasiswa").update(validatedData).eq("nim", nim).select().single();

        if (error) {
            if (error.code === 'PGRST116') { // Error jika data untuk diupdate tidak ditemukan
                return NextResponse.json({ error: "Mahasiswa tidak ditemukan untuk diupdate" }, { status: 404, headers: corsHeaders });
            }
            return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
        }
        return NextResponse.json(data, { headers: corsHeaders });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400, headers: corsHeaders });
        }
        return NextResponse.json({ error: "Request body tidak valid atau bukan JSON" }, { status: 400, headers: corsHeaders });
    }
}

// DELETE mahasiswa by NIM
export async function DELETE(req, { params }) {
    const { nim } = params;
    const { error, count } = await supabase.from("mahasiswa").delete({ count: 'exact' }).eq("nim", nim);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }

    if (count === 0) {
        return NextResponse.json({ error: "Mahasiswa tidak ditemukan untuk dihapus" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ message: `Mahasiswa dengan NIM ${nim} berhasil dihapus` }, { headers: corsHeaders });
}