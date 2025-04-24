import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { id, image_url, username } = body.data;

  console.log({ id, image_url, username });
  const { error } = await supabase.from("Users").insert([
    {
      clerk_user_id: id,
      pfp: image_url,
      username,
    },
  ]);

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json(
      { error: "Failed to insert user" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
