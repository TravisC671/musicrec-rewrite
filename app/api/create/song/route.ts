import supabase from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import qs from "querystring";

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, recommendationID } = await req.json();

  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  const trackId = match?.[1];

  if (!trackId)
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });

  // Get access token
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify({ grant_type: "client_credentials" }),
  });

  const tokenData = await tokenRes.json();

  console.log(tokenData);

  const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  const track = await trackRes.json();

  console.log(track);

  const data = {
    name: track.name,
    artist: track.artists.map((a: any) => a.name).join(", "),
    album: track.album.name,
    cover: track.album.images?.[0]?.url || "",
  };

  const { error: insertError } = await supabase.from("Songs").insert([
    {
      is_rated: false,
      recommendation_id: parseInt(recommendationID),
      sender_clerk_user_id: userId,
      song_author: data.artist,
      song_cover: data.cover,
      song_name: data.name,
      spotify_url: url,
    },
  ]);

  if (insertError) {
    console.error("Supabase insert error:", insertError);
    return NextResponse.json(
      { error: "Failed to insert song" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
