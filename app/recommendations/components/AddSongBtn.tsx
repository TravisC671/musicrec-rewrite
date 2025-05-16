"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Song } from "./types";

type AddSongType = {
  currentRec: number | null;
  userId: string;
  setSongsByRec: Dispatch<SetStateAction<Record<number, Song[]>>>;
};

export default function AddSong({
  currentRec,
  userId,
  setSongsByRec,
}: AddSongType) {
  const [isActive, setActive] = useState(true);

  const urlRef = useRef<HTMLInputElement | null>(null);

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      await fetchSong()
    }
  };

  const fetchSong = async () => {
    if (urlRef.current == null) {
      return;
    }

    const res = await fetch("/api/create/song", {
      method: "POST",
      body: JSON.stringify({
        url: urlRef.current.value,
        recommendationID: currentRec,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    //TODO check if data is valid
    if (currentRec) {
      let fakeData: Song = {
        created_at: "",
        id: Date.now(), //cause of key prop
        is_rated: false,
        recommendation_id: currentRec,
        sender_clerk_user_id: userId,
        song_author: data.artist,
        song_cover: data.cover,
        song_name: data.name,
        spotify_url: urlRef.current.value,
      };
      if (!data.error) {
        setSongsByRec((prev) => ({
          ...prev,
          [currentRec]: [...(prev[currentRec] || []), fakeData],
        }));
      }
    }

    setActive(false);
    urlRef.current.value = "";
    console.log(data);
  };

  if (currentRec) {
    return (
      <>
        <Button
          onClick={() => setActive(!isActive)}
          className={`${!isActive ? "w-40" : "w-24"
            } cursor-pointer transition-all duration-300 text-base font-bold ease-in-out overflow-hidden bg-gradient-to-br from-[#1DCD9F] to-[#7BFF9E]`}
        >
          {!isActive ? "Add Song" : "Cancel"}
        </Button>
        <Input
          onKeyDown={handleKeyDown}
          ref={urlRef}
          placeholder="Paste Spotify Url"
          className={`
            transition-all duration-300 ease-in-out
             outline-[#2F3B37] px-3 py-1
            ${isActive ? "w-full opacity-100" : "w-0 opacity-0"} overflow-hidden
          `}
        />
        <Button
          onClick={fetchSong}
          className={`
            transition-all duration-300 font-bold text-base ease-in-out bg-primary
              px-3 py-1 w-fit bg-gradient-to-br from-[#FFE666] to-[#ff7b7b]
            ${isActive ? "opacity-100" : "opacity-0"} overflow-hidden
          `}
        >
          Send
        </Button>
      </>
    );
  }
}
