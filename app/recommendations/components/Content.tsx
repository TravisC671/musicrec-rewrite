"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddSong from "./AddSongBtn";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import Recommendations from "./Recommendations";
import { useSupabase } from "@/lib/supabase-provider";

export default function Content({ userId }: { userId: string }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentRec, setCurrentRec] = useState<number | null>(null);

  const { supabase } = useSupabase();

  const [songsByRec, setSongsByRec] = useState<Record<number, Song[]>>({});
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);

  const [ratingsBySongId, setRatingsBySongId] = useState<
    Record<number, Rating | null>
  >({});

  useEffect(() => {
    const fetchSongs = async () => {
      if (!currentRec || songsByRec[currentRec] || !supabase) return;
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
        setSongsByRec((prev) => ({ ...prev, [currentRec]: songs }));
      }
    };

    fetchSongs();
  }, [currentRec]);

  return (
    <main className="flex flex-col h-full w-full max-w-6xl row-start-1 items-center sm:items-start ">
      <Recommendations
        userId={userId}
        recommendations={recommendations}
        setRecommendations={setRecommendations}
        currentRec={currentRec}
        setCurrentRec={setCurrentRec}
        setSelectedSongId={setSelectedSongId}
      />
      <div className="w-full h-full border-1 rounded-lg rounded-tl-none outline-1 outline-[#2F3B37] bg-black ml-[1px] grid grid-cols-[1fr_1fr]">
        {currentRec ? (
          <>
            <div className="grid grid-rows-[76px_1fr] col-start-1">
              <div className=" row-start-1 flex flex-row gap-2 p-[20px] w-[calc(100%-30px)] ml-[20px] pl-0 pr-0 justify-between">
                <AddSong
                  userId={userId}
                  currentRec={currentRec}
                  setSongsByRec={setSongsByRec}
                />
              </div>
              <ScrollArea className="row-start-2 m-2 h-[calc(100vh-301px)] bg-[#101314] w-[calc(100%-30px)] mt-0 mb-2 rounded-md outline-1 ml-[20px]">
                <div className="flex flex-col py-1">
                  <Songs
                    songsByRec={songsByRec}
                    currentRec={currentRec}
                    recommendations={recommendations}
                    userId={userId}
                    setSelectedSongId={setSelectedSongId}
                    ratingsBySongId={ratingsBySongId}
                  />
                </div>
              </ScrollArea>
            </div>
            {selectedSongId && (
              <DisplayArea
                songsByRec={songsByRec}
                ratingsBySongId={ratingsBySongId}
                setRatingsBySongId={setRatingsBySongId}
                currentRec={currentRec}
                userId={userId}
                selectedSongId={selectedSongId}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center col-span-2">
            <h1 className="text-4xl">Select or Create a chat to get started</h1>
          </div>
        )}
      </div>
    </main>
  );
}

type SongsFn = {
  songsByRec: Record<number, Song[]>;
  currentRec: number | null;
  recommendations: Recommendation[];
  userId: string;
  setSelectedSongId: Dispatch<SetStateAction<number | null>>;
  ratingsBySongId: Record<number, Rating | null>;
};
function Songs({
  songsByRec,
  currentRec,
  recommendations,
  userId,
  setSelectedSongId,
  ratingsBySongId,
}: SongsFn) {
  if (!currentRec || !songsByRec[currentRec]) return null;

  const selRec = recommendations.find((rec) => rec.id === currentRec);

  if (!selRec) return null;

  return songsByRec[currentRec].map((song, index) => {
    const rating = ratingsBySongId[song.id];
    let senderPFP = "";
    if (userId === song.sender_clerk_user_id) {
      senderPFP =
        userId === selRec.user_1_clerk_id
          ? selRec.user_1_pfp
          : selRec.user_2_pfp;
    } else {
      senderPFP =
        userId === selRec.user_1_clerk_id
          ? selRec.user_2_pfp
          : selRec.user_1_pfp;
    }
    return (
      <div
        key={`song${song.id}`}
        onClick={() => setSelectedSongId(song.id)}
        className="grid px-2 py-1 grid-cols-[48px_224px_1fr_1fr] gap-2 group hover:bg-accent group"
      >
        <img
          src={song.song_cover}
          className="w-12 rounded-[2px] pointer-events-none"
        />
        <div className="w-56 pointer-events-none">
          <p className="overflow-ellipsis">{song.song_name}</p>
          <p className="overflow-ellipsis">{song.song_author}</p>
        </div>
        <div className="my-auto">
          {rating && (
            <Badge className="h-min my-auto">
              {ratingLabels[rating.rating]}
            </Badge>
          )}
        </div>

        {senderPFP !== "" && (
          <div className="w-8 h-8 my-auto">
            <img
              src={senderPFP}
              alt="sender"
              className="col-start-3 object-cover h-full w-full rounded-full"
            />
          </div>
        )}
      </div>
    );
  });
}

type DisplayAreaFn = {
  songsByRec: Record<number, Song[]>;
  ratingsBySongId: Record<number, Rating | null>;
  setRatingsBySongId: React.Dispatch<
    React.SetStateAction<Record<number, Rating | null>>
  >;
  currentRec: number | null;
  userId: string;
  selectedSongId: number;
};
function DisplayArea({
  songsByRec,
  ratingsBySongId,
  setRatingsBySongId,
  currentRec,
  userId,
  selectedSongId,
}: DisplayAreaFn) {
  let rating = "";
  let comment = "";

  if (!currentRec) return null;

  const selectedSong = songsByRec[currentRec]?.find(
    (song) => song.id === selectedSongId
  );

  if (!selectedSong) return null;

  if (ratingsBySongId[selectedSongId]) {
    rating = ratingLabels[ratingsBySongId[selectedSongId].rating];
    comment = ratingsBySongId[selectedSongId].comment;
  }

  return (
    <div className="col-start-2 pl-[10px] p-[20px] gap-[20px] grid grid-rows-[216px_2.25rem_216px]">
      {/* Song Info */}
      <div className="w-full bg-[#101314] p-[20px] rounded-md outline-1 grid grid-cols-[11rem_1fr] row-start-1 gap-[20px]">
        <div className="w-44 h-44 rounded-sm overflow-hidden col-start-1">
          <img src={selectedSong.song_cover} alt={selectedSong.song_name} />
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
      <RateArea
        setRatingsBySongId={setRatingsBySongId}
        ratingExists={ratingsBySongId[selectedSongId] !== null}
        initialRating={rating}
        initialComment={comment}
        isSender={userId === selectedSong.sender_clerk_user_id}
        userId={userId}
        songId={selectedSong.id}
      />
    </div>
  );
}

type RateAreaFn = {
  setRatingsBySongId: React.Dispatch<
    React.SetStateAction<Record<number, Rating | null>>
  >;
  ratingExists: boolean;
  initialRating: string;
  initialComment: string;
  isSender: boolean;
  userId: string;
  songId: number;
};
function RateArea({
  setRatingsBySongId,
  ratingExists,
  initialRating,
  initialComment,
  isSender,
  userId,
  songId,
}: RateAreaFn) {
  const [canEdit, setCanEdit] = useState(!ratingExists);
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const { supabase } = useSupabase();

  const handleBtn = async () => {
    if (!canEdit) {
      setCanEdit(true);
    } else {
      if (!ratingExists && supabase) {
        let numRating = ratingLabels.indexOf(rating);
        //later use upsert but until then we will not allow the user to edit.
        const { data, error } = await supabase.from("Ratings").insert([
          {
            song_id: songId,
            clerk_user_id: userId,
            rating: numRating,
            comment: comment,
          },
        ]);

        if (error) {
          console.error("Insert failed:", error.message);
        } else {
          console.log("Inserted successfully");

          let fakeRating: Rating = {
            id: Math.floor(Math.random() * 1000),
            rating: numRating,
            comment: comment,
            created_at: "",
            clerk_user_id: userId,
          };

          setRatingsBySongId((prev) => ({
            ...prev,
            [songId]: fakeRating,
          }));
        }
      }
      //setCanEdit(false);
    }
  };

  useEffect(() => {
    setCanEdit(!ratingExists);
    setRating(initialRating);
    setComment(initialComment);
  }, [ratingExists, initialRating, initialComment]);

  if (isSender && !ratingExists) {
    return <h1>Your friend hasn't rated your song yet...</h1>;
  }

  return (
    <>
      <div className="row-start-2 flex justify-between">
        <Select
          disabled={!canEdit || isSender}
          value={rating}
          onValueChange={setRating}
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

        {!isSender && (
          <Button className="w-28 font-bold text-base" onClick={handleBtn}>
            {!canEdit ? "Edit" : "Send"}
          </Button>
        )}
      </div>

      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={!canEdit || isSender}
        placeholder="Add a comment (optional)"
        className="h-4"
      />
    </>
  );
}
export type { Recommendation };
