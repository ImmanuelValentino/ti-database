import { supabase } from "@/lib/supabase";

// GET all users
export async function GET() {
    const { data, error } = await supabase.from("users").select("*");
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data);
}

// POST create user
export async function POST(req) {
    const body = await req.json();
    const { data, error } = await supabase
        .from("users")
        .insert([{ name: body.name, email: body.email }])
        .select();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data[0]);
}
