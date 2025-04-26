"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddSong from "./AddSong";
import Recs from "./Recs";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type SongType = {
  created_at: string;
  id: number;
  is_rated: boolean;
  recommendation_id: string;
  sender_clerk_user_id: string;
  song_author: string;
  song_cover: string;
  song_name: string;
  spotify_url: string;
};

export default function Content({ userId }: { userId: string }) {
  const [currentRec, setCurrentRec] = useState<string>("");
  const [songData, setSongData] = useState<Record<string, SongType[]>>({});

  useEffect(() => {
    const fetchSongs = async () => {
      if (songData[currentRec] || currentRec === "") return;

      const { data, error } = await supabase
        .from("Songs")
        .select()
        .eq("recommendation_id", parseInt(currentRec));
      if (error) {
        console.error(error);
      } else {
        setSongData((prev) => ({ ...prev, [currentRec]: data }));
      }
    };

    fetchSongs();
  }, [currentRec]);

  return (
    <main className="flex flex-col h-full w-full max-w-6xl row-start-1 items-center sm:items-start ">
      <Recs
        userId={userId}
        currentRec={currentRec}
        setCurrentRec={setCurrentRec}
      />
      <div className="w-full h-full border-1 rounded-lg rounded-tl-none grid grid-rows-[3.25rem_1fr] outline-1 outline-[#2F3B37] bg-black">
        <div className=" row-start-1 flex flex-row gap-2 p-2 w-1/2 ml-2 pl-0 pr-0 justify-between">
          <AddSong currentRec={currentRec} setSongData={setSongData} />
        </div>
        <ScrollArea className="row-start-2 m-2 h-[calc(100vh-17rem)] bg-[#101314] w-1/2 mt-0 mb-2 rounded-md outline-1">
          <div className="flex flex-col">
            {!songData[currentRec] ? (
              <p></p>
            ) : (
              songData[currentRec].map((song) => (
                <div
                  key={song.id}
                  className="flex px-2 py-1 flex-row gap-2 group hover:bg-accent"
                >
                  <img src={song.song_cover} className="w-12 rounded-[2px]" />
                  <div className="w-72">
                    <p>{song.song_name}</p>
                    <p>{song.song_author}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}

export type { SongType };
