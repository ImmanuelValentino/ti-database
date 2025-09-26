import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

// Skema untuk UPDATE, semua field bersifat opsional
const UpdateMahasiswaSchema = z.object({
    nama: z.string().min(1, { message: "Nama tidak boleh kosong" }).optional(),
    jurusan: z.string().min(1, { message: "Jurusan tidak boleh kosong" }).optional(),
})
    .refine(data => Object.keys(data).length > 0, {
        message: "Request body tidak boleh kosong. Kirim setidaknya satu field (nama/jurusan) untuk diupdate.",
    });


// GET (tidak berubah)
export async function GET(req, { params }) {
    // ... kode GET Anda yang sudah ada ...
}

// Update mahasiswa by NIM DENGAN VALIDASI
export async function PUT(req, { params }) {
    try {
        const { nim } = params;
        const body = await req.json();

        // Validasi body request
        const validatedData = UpdateMahasiswaSchema.parse(body);

        const { data, error } = await supabase
            .from("mahasiswa")
            .update(validatedData) // Gunakan data yang sudah divalidasi
            .eq("nim", nim)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(data);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Request body tidak valid" }, { status: 400 });
    }
}

// DELETE (tidak berubah)
export async function DELETE(req, { params }) {
    // ... kode DELETE Anda yang sudah ada ...
}