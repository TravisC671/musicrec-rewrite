import supabase from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { user_1_username, user_2_username } = body;

  //should validate this
  //could they do sql injections here?
  const { data, error } = await supabase
    .from("Users")
    .select()
    .in("username", [user_1_username, user_2_username]);

  //must validate that either of them's userID matches the one requesting it

  console.log(data);

  return NextResponse.json({ success: true });
}
