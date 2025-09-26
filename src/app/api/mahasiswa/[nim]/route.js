import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

// 1. Definisikan headers CORS di satu tempat
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Skema untuk UPDATE, semua field bersifat opsional
const UpdateMahasiswaSchema = z.object({
    nama: z.string().min(1, { message: "Nama tidak boleh kosong" }).optional(),
    jurusan: z.string().min(1, { message: "Jurusan tidak boleh kosong" }).optional(),
})
    .refine(data => Object.keys(data).length > 0, {
        message: "Request body tidak boleh kosong. Kirim setidaknya satu field (nama/jurusan) untuk diupdate.",
    });

// Ambil mahasiswa berdasarkan NIM
export async function GET(req, { params }) {
    const { nim } = params;

    const { data, error } = await supabase
        .from("mahasiswa")
        .select("*")
        .eq("nim", nim)
        .single();

    if (error) {
        return NextResponse.json({ error: "Mahasiswa tidak ditemukan" }, { status: 404, headers: corsHeaders });
    }
    return NextResponse.json(data, { headers: corsHeaders });
}

// Update mahasiswa by NIM
export async function PUT(req, { params }) {
    try {
        const { nim } = params;
        const body = await req.json();
        const validatedData = UpdateMahasiswaSchema.parse(body);

        const { data, error } = await supabase
            .from("mahasiswa")
            .update(validatedData)
            .eq("nim", nim)
            .select()
            .single();

        if (error) {
            // Cek jika mahasiswa tidak ditemukan saat update
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: "Mahasiswa tidak ditemukan untuk diupdate" }, { status: 404, headers: corsHeaders });
            }
            return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
        }
        return NextResponse.json(data, { headers: corsHeaders });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400, headers: corsHeaders });
        }
        return NextResponse.json({ error: "Request body tidak valid" }, { status: 400, headers: corsHeaders });
    }
}

// Hapus mahasiswa by NIM
export async function DELETE(req, { params }) {
    const { nim } = params;

    const { error } = await supabase.from("mahasiswa").delete().eq("nim", nim);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
    return NextResponse.json({ message: `Mahasiswa dengan NIM ${nim} dihapus` }, { headers: corsHeaders });
}