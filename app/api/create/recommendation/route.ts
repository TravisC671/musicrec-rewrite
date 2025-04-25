import supabase from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { user_2_username } = body;

  console.log(userId, user_2_username);
  //should validate this
  //could they do sql injections here?
  const { data: userData, error: userError } = await supabase
    .from("Users")
    .select()
    .or(`username.eq.${user_2_username},clerk_user_id.eq.${userId}`);

  //must validate that either of them's userID matches the one requesting it

  //console.log(data, error);

  if (userError != null || userData.length != 2) {
    //idk if error code is right
    return NextResponse.json({ error: "user fetch failed" }, { status: 401 });
  }

  const user1 = userData.find((u) => u.clerk_user_id === userId);
  const user2 = userData.find((u) => u.username === user_2_username);

  console.log("user1", user1);
  console.log("user2", user2);
  //TODO make sure there cannot be duplicates
  const { error: insertError } = await supabase.from("Recommendations").insert([
    {
      user_1_username: user1.username,
      user_1_clerk_id: user1.clerk_user_id,
      user_1_pfp: user1.pfp,
      user_2_username: user2.username,
      user_2_clerk_id: user2.clerk_user_id,
      user_2_pfp: user2.pfp,
    },
  ]);

  if (insertError) {
    console.error("Supabase insert error:", insertError);
    return NextResponse.json(
      { error: "Failed to create recommendation" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
