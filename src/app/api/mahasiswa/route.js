import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: ambil semua mahasiswa
export async function GET() {
    const { data, error } = await supabase.from("mahasiswa").select("*");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// POST: tambah mahasiswa
export async function POST(req) {
    const body = await req.json();
    const { nim, nama, jurusan } = body;

    const { data, error } = await supabase
        .from("mahasiswa")
        .insert([{ nim, nama, jurusan }])
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data[0]);
}
