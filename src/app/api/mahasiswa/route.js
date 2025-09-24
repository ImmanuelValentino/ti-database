import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Ambil semua mahasiswa
export async function GET() {
    const { data, error } = await supabase.from("mahasiswa").select("*");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

// Tambah mahasiswa baru
export async function POST(req) {
    const body = await req.json();

    const { data, error } = await supabase
        .from("mahasiswa")
        .insert([body]) // body harus ada nim, nama, jurusan
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data[0], { status: 201 });
}
