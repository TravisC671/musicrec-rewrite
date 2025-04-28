"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddSong from "./AddSongBtn";
import Recs from "./Recommendations";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import SRToggle from "./SRToggle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Ellipsis from "@/components/icons/ellipsis";
import { Badge } from "@/components/ui/badge";
import { ratingLabels } from "@/lib/constants";
import { PostgrestError } from "@supabase/supabase-js";
import { Rating, Recommendation, Song, SupaSongData } from "./types";

export default function Content({ userId }: { userId: string }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentRec, setCurrentRec] = useState<number | null>(null);

  const [songsByRec, setSongsByRec] = useState<Record<number, Song[]>>({});
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);

  const [ratingsBySongId, setRatingsBySongId] = useState<
    Record<number, Rating | null>
  >({});

  useEffect(() => {
    const fetchSongs = async () => {
      if (!currentRec || songsByRec[currentRec]) return;
      console.log("fetching");
      const {
        data,
        error,
      }: { data: SupaSongData; error: PostgrestError | null } = await supabase
        .from("Songs")
        .select(
          `
        id,
        created_at,
        song_name,
        song_author,
        song_cover,
        spotify_url,
        sender_clerk_user_id,
        recommendation_id,
        is_rated,
        Ratings (
          id,
          clerk_user_id,
          rating,
          comment,
          created_at
        )
      `
        )
        .eq("recommendation_id", currentRec);

      if (error || data === null) {
        console.error(error);
      } else {
        const songs: Song[] = data.map((song) => {
          let rating: Rating | null = null;
          let songRating = song.Ratings[0];

          if (songRating) {
            rating = {
              id: songRating.id,
              clerk_user_id: songRating.clerk_user_id,
              rating: songRating.rating,
              comment: songRating.comment,
              created_at: songRating.created_at,
            };
          }
          setRatingsBySongId((prev) => ({ ...prev, [song.id]: rating }));

          return {
            id: Number(song.id),
            created_at: String(song.created_at),
            song_name: String(song.song_name),
            song_author: String(song.song_author),
            song_cover: String(song.song_cover),
            spotify_url: String(song.spotify_url),
            sender_clerk_user_id: String(song.sender_clerk_user_id),
            recommendation_id: Number(song.recommendation_id),
            is_rated: Boolean(song.is_rated),
          };
        });
        console.log("setting songs");
        setSongsByRec((prev) => ({ ...prev, [currentRec]: songs }));
      }
    };

    fetchSongs();
  }, [currentRec]);

  return (
    <main className="flex flex-col h-full w-full max-w-6xl row-start-1 items-center sm:items-start ">
      <Recs
        userId={userId}
        recommendations={recommendations}
        setRecommendations={setRecommendations}
        currentRec={currentRec}
        setCurrentRec={setCurrentRec}
        setSelectedSongId={setSelectedSongId}
      />
      <div className="w-full h-full border-1 rounded-lg rounded-tl-none outline-1 outline-[#2F3B37] bg-black ml-[1px] grid grid-cols-[1fr_1fr]">
        <div className="grid grid-rows-[56px_76px_1fr] col-start-1">
          <div className="row-start-1 h-[56px]">
            <SRToggle />
          </div>
          <div className=" row-start-2 flex flex-row gap-2 p-[20px] w-[calc(100%-30px)] ml-[20px] pl-0 pr-0 justify-between">
            <AddSong currentRec={currentRec} setSongsByRec={setSongsByRec} />
          </div>
          <ScrollArea className="row-start-3 m-2 h-[calc(100vh-357px)] bg-[#101314] w-[calc(100%-30px)] mt-0 mb-2 rounded-md outline-1 ml-[20px]">
            <div className="flex flex-col py-1">
              <Songs
                songsByRec={songsByRec}
                currentRec={currentRec}
                setSelectedSongId={setSelectedSongId}
                ratingsBySongId={ratingsBySongId}
              />
            </div>
          </ScrollArea>
        </div>
        <DisplayArea
          songsByRec={songsByRec}
          ratingsBySongId={ratingsBySongId}
          currentRec={currentRec}
          selectedSongId={selectedSongId}
        />
      </div>
    </main>
  );
}

type SongsFn = {
  songsByRec: Record<number, Song[]>;
  currentRec: number | null;
  setSelectedSongId: Dispatch<SetStateAction<number | null>>;
  ratingsBySongId: Record<number, Rating | null>;
};
function Songs({
  songsByRec,
  currentRec,
  setSelectedSongId,
  ratingsBySongId,
}: SongsFn) {
  if (currentRec && songsByRec[currentRec]) {
    console.log(songsByRec[currentRec]);
    return songsByRec[currentRec].map((song, index) => {
      const rating = ratingsBySongId[song.id];
      console.log(song.id);
      return (
        <div
          key={`song${song.id}`}
          onClick={() => {
            setSelectedSongId(song.id);
            console.log("selected song " + song.id);
          }}
          className="flex px-2 py-1 flex-row gap-2 group hover:bg-accent group"
        >
          <img
            src={song.song_cover}
            className="w-12 rounded-[2px] pointer-events-none"
          />
          <div className="w-56 pointer-events-none">
            <p className="overflow-ellipsis">{song.song_name}</p>
            <p className="overflow-ellipsis">{song.song_author}</p>
          </div>
          {rating && (
            <Badge className="h-min my-auto">
              {ratingLabels[rating.rating]}
            </Badge>
          )}

          <Button
            className="m-auto opacity-0 group-hover:opacity-100"
            variant={"menu"}
          >
            <Ellipsis />
          </Button>
        </div>
      );
    });
  }
}

type DisplayAreaFn = {
  songsByRec: Record<number, Song[]>;
  ratingsBySongId: Record<number, Rating | null>;
  currentRec: number | null;
  selectedSongId: number | null;
};
function DisplayArea({
  songsByRec,
  ratingsBySongId,
  currentRec,
  selectedSongId,
}: DisplayAreaFn) {
  if (currentRec && selectedSongId) {
    let rating = ratingsBySongId[selectedSongId];

    let selectedSong = songsByRec[currentRec].find(
      (song) => song.id === selectedSongId
    );
    if (selectedSong) {
      return (
        <div className="col-start-2 pl-[10px] p-[20px] gap-[20px] grid grid-rows-[216px_2.25rem_216px]">
          <div className="w-full bg-[#101314] p-[20px] rounded-md outline-1 grid grid-cols-[11rem_1fr] row-start-1 gap-[20px]">
            <div className="w-44 h-44 rounded-sm overflow-hidden col-start-1">
              <img src={selectedSong.song_cover}></img>
            </div>
            <div className="max-w-full overflow-hidden col-start-2">
              <h1 className="text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedSong.song_name}
              </h1>
              <h1 className="text-xl font-normal overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedSong.song_author}
              </h1>
            </div>
          </div>
          <div className="row-start-2 flex justify-between">
            <Select
              defaultValue={rating ? ratingLabels[rating.rating] : undefined}
            >
              <SelectTrigger className="w-[180px] duration-0">
                <SelectValue placeholder="Select a Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Ratings</SelectLabel>
                  <SelectItem value="S">S - Instant Add</SelectItem>
                  <SelectItem value="A">A - Loved It</SelectItem>
                  <SelectItem value="B">B - Solid</SelectItem>
                  <SelectItem value="C">C - It's Fine</SelectItem>
                  <SelectItem value="D">D - Not My Thing</SelectItem>
                  <SelectItem value="F">F - Skip</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button className="w-28 font-bold text-base">Send</Button>
          </div>
          <Textarea placeholder="Add a comment (optional)" className="h-4" />
        </div>
      );
    }
  }
}

export type { Recommendation };
