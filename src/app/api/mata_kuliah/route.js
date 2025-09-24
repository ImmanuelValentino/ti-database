import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET semua mata kuliah
export async function GET() {
    const { data, error } = await supabase.from("mata_kuliah").select("*");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// POST tambah mata kuliah
export async function POST(req) {
    const body = await req.json();
    const { kode_mk, nama_mk, sks } = body;

    const { data, error } = await supabase
        .from("mata_kuliah")
        .insert([{ kode_mk, nama_mk, sks }])
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
