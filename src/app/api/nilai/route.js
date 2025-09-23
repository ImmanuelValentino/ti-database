import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: ambil nilai dengan join mahasiswa + mata_kuliah
export async function GET() {
    const { data, error } = await supabase
        .from("nilai")
        .select(`
      id,
      nilai,
      mahasiswa (nim, nama),
      mata_kuliah (kode_mk, nama_mk, sks)
    `);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// POST: tambah nilai
export async function POST(req) {
    const body = await req.json();
    const { nim, kode_mk, nilai } = body;

    const { data, error } = await supabase
        .from("nilai")
        .insert([{ nim, kode_mk, nilai }])
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data[0]);
}
