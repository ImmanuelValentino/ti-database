import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Ambil mahasiswa berdasarkan NIM
export async function GET(req, { params }) {
    const { nim } = params;

    const { data, error } = await supabase
        .from("mahasiswa")
        .select("*")
        .eq("nim", nim)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(data);
}

// Update mahasiswa by NIM
export async function PUT(req, { params }) {
    const { nim } = params;
    const body = await req.json();

    const { data, error } = await supabase
        .from("mahasiswa")
        .update(body) // body boleh nama / jurusan
        .eq("nim", nim)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

// Hapus mahasiswa by NIM
export async function DELETE(req, { params }) {
    const { nim } = params;

    const { error } = await supabase.from("mahasiswa").delete().eq("nim", nim);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: `Mahasiswa dengan NIM ${nim} dihapus` });
}
