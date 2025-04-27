"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { SongType } from "./Content";

type AddSongType = {
  currentRec: string;
  setSongData: Dispatch<SetStateAction<Record<string, SongType[]>>>;
};

export default function AddSong({ currentRec, setSongData }: AddSongType) {
  const [isActive, setActive] = useState(true);

  const urlRef = useRef<HTMLInputElement | null>(null);

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
    let fakeData: SongType = {
      created_at: "",
      id: Date.now(), //cause of key prop
      is_rated: false,
      recommendation_id: currentRec,
      sender_clerk_user_id: "",
      song_author: data.artist,
      song_cover: data.cover,
      song_name: data.name,
      spotify_url: urlRef.current.value,
      Ratings: [],
    };

    setActive(false);
    urlRef.current.value = "";
    if (!data.error) {
      setSongData((prev) => ({
        ...prev,
        [currentRec]: [...(prev[currentRec] || []), fakeData],
      }));
    }
    console.log(data);
  };

  return (
    <>
      <Button
        onClick={() => setActive(!isActive)}
        className={`${
          !isActive ? "w-40" : "w-24"
        } cursor-pointer transition-all duration-300 text-base font-bold ease-in-out overflow-hidden`}
      >
        {!isActive ? "Add Song" : "Cancel"}
      </Button>
      <Input
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
              px-3 py-1 w-fit 
            ${isActive ? "opacity-100" : "opacity-0"} overflow-hidden
          `}
      >
        Send
      </Button>
    </>
  );
}
