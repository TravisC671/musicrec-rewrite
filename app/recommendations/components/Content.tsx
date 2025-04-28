"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddSong from "./AddSongBtn";
import Recs from "./Recs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  Ratings: RatingType[];
};

type RatingType = {
  id: number;
  song_id: number;
  rating: number;
  comment: string;
  created_at: string;
  clerk_user_id: string;
};

type selectedSongType = {
  currentRec: string;
  selectedSong: number | null;
};

export default function Content({ userId }: { userId: string }) {
  const [currentRec, setCurrentRec] = useState<string>("");
  const [songData, setSongData] = useState<Record<string, SongType[]>>({});
  const [selectedSong, setSelectedSong] = useState<selectedSongType>({
    currentRec: "",
    selectedSong: null,
  });

  useEffect(() => {
    const fetchSongs = async () => {
      if (songData[currentRec] || currentRec === "") return;

      const { data, error } = await supabase
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

      if (error) {
        console.error(error);
      } else {
        console.log(data);
        setSongData((prev) => ({ ...prev, [currentRec]: data as SongType[] }));
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
      <div className="w-full h-full border-1 rounded-lg rounded-tl-none outline-1 outline-[#2F3B37] bg-black ml-[1px] grid grid-cols-[1fr_1fr]">
        <div className="grid grid-rows-[56px_76px_1fr] col-start-1">
          <div className="row-start-1 h-[56px]">
            <SRToggle />
          </div>
          <div className=" row-start-2 flex flex-row gap-2 p-[20px] w-[calc(100%-30px)] ml-[20px] pl-0 pr-0 justify-between">
            <AddSong currentRec={currentRec} setSongData={setSongData} />
          </div>
          <ScrollArea className="row-start-3 m-2 h-[calc(100vh-357px)] bg-[#101314] w-[calc(100%-30px)] mt-0 mb-2 rounded-md outline-1 ml-[20px]">
            <div className="flex flex-col py-1">
              {!songData[currentRec] ? (
                <p></p>
              ) : (
                <Songs
                  songData={songData}
                  currentRec={currentRec}
                  setSelectedSong={setSelectedSong}
                />
              )}
            </div>
          </ScrollArea>
        </div>
        <DisplayArea
          songData={songData}
          currentRec={currentRec}
          selectedSong={selectedSong}
        />
      </div>
    </main>
  );
}

type SongsFnType = {
  songData: Record<string, SongType[]>;
  currentRec: string;
  setSelectedSong: Dispatch<SetStateAction<selectedSongType>>;
};
function Songs({ songData, currentRec, setSelectedSong }: SongsFnType) {
  return songData[currentRec].map((song, index) => (
    <div
      key={song.id}
      onClick={() =>
        setSelectedSong({
          currentRec: currentRec,
          selectedSong: index,
        })
      }
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
      {song.Ratings[0] && (
        <Badge className="h-min my-auto">
          {ratingLabels[song.Ratings[0].rating]}
        </Badge>
      )}

      <Button
        className="m-auto opacity-0 group-hover:opacity-100"
        variant={"menu"}
      >
        <Ellipsis />
      </Button>
    </div>
  ));
}

type DisplayAreaFn = {
  songData: Record<string, SongType[]>;
  currentRec: string;
  selectedSong: selectedSongType;
};
function DisplayArea({ songData, currentRec, selectedSong }: DisplayAreaFn) {
  let rating = "";

  if (selectedSong.selectedSong !== null) {
    rating =
      ratingLabels[
        songData[currentRec][selectedSong.selectedSong].Ratings[0]?.rating
      ] ?? "";
  }
  if (
    selectedSong.currentRec === currentRec &&
    selectedSong.selectedSong !== null
  ) {
    return (
      <div className="col-start-2 pl-[10px] p-[20px] gap-[20px] grid grid-rows-[216px_2.25rem_216px]">
        <div className="w-full bg-[#101314] p-[20px] rounded-md outline-1 flex flex-row gap-[20px] row-start-1">
          <div className="w-44 h-44 rounded-sm overflow-hidden">
            <img
              src={songData[currentRec][selectedSong.selectedSong].song_cover}
            ></img>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {songData[currentRec][selectedSong.selectedSong].song_name}
            </h1>
            <h1 className="text-xl font-normal">
              {songData[currentRec][selectedSong.selectedSong].song_author}
            </h1>
          </div>
        </div>
        <div className="row-start-2 flex justify-between">
          {rating !== "" ? (
            <Select value={rating}>
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
          ) : (
            <Select>
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
          )}

          <Button className="w-28 font-bold text-base">Send</Button>
        </div>
        <Textarea placeholder="Add a comment (optional)" className="h-4" />
      </div>
    );
  }
}

export type { SongType };
