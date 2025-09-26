import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Ambil semua mahasiswa
export async function GET() {
    const { data, error } = await supabase.from("mahasiswa").select("*");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // TAMBAHKAN BAGIAN HEADERS INI
    return NextResponse.json(data, {
        headers: {
            'Access-Control-Allow-Origin': '*', // Izinkan semua origin
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', // Izinkan metode ini
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

// Tambah mahasiswa baru (juga perlu ditambahkan headers)
export async function POST(req) {
    const body = await req.json();

    const { data, error } = await supabase
        .from("mahasiswa")
        .insert([body])
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // TAMBAHKAN JUGA HEADERS DI SINI
    return NextResponse.json(data[0], {
        status: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}