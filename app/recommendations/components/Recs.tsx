"use client";
import supabase from "@/lib/supabaseClient";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type RecsType = {
  userId: string;
  currentRec: string;
  setCurrentRec: Dispatch<SetStateAction<string>>;
};

type RecordTbType = {
  created_at: string;
  id: number;
  user_1_clerk_id: string;
  user_1_pfp: string;
  user_1_username: string;
  user_2_clerk_id: string;
  user_2_pfp: string;
  user_2_username: string;
};
export default function Recs({ userId, currentRec, setCurrentRec }: RecsType) {
  const [recs, setRecs] = useState<RecordTbType[]>([]);

  useEffect(() => {
    const fetchRecs = async () => {
      const { data, error } = await supabase
        .from("Recommendations")
        .select()
        .or(`user_1_clerk_id.eq.${userId},user_2_clerk_id.eq.${userId}`);

      console.log(data);
      //kinda jank
      if (data) {
        setRecs(data as RecordTbType[]);
      }
    };

    fetchRecs();
  }, []);

  return (
    <div className="w-full h-[71px] flex">
      {recs.map((rec) => (
        <RecBtn
          key={rec.id}
          recId={rec.id}
          img={userId == rec.user_1_clerk_id ? rec.user_2_pfp : rec.user_1_pfp}
          user2Name={
            userId == rec.user_1_clerk_id
              ? rec.user_2_username
              : rec.user_1_username
          }
          isActive={rec.id.toString() == currentRec}
          setCurrentRec={setCurrentRec}
        />
      ))}
      <CreateRec />
    </div>
  );
}

type RecBtnType = {
  recId: number;
  img: string;
  user2Name: string; //user2 here is the other user
  isActive: boolean;
  setCurrentRec: Dispatch<SetStateAction<string>>;
};
function RecBtn({
  recId,
  img,
  user2Name,
  isActive,
  setCurrentRec,
}: RecBtnType) {
  return (
    <Button
      onClick={() => setCurrentRec(recId.toString())}
      className={`h-[72px] ${
        isActive
          ? "w-52 border-1 border-[#2F3B37] bg-[#101314] hover:bg-[#161a1b]"
          : "w-[72px] border-0"
      } transition-all duration-300 rounded-b-none flex gap-2 justify-baseline cursor-pointer p-2`}
      variant={"ghost"}
    >
      <div className="h-[55px] w-[55px] overflow-hidden rounded-[4px] shrink-0">
        <img
          src={img}
          alt={`${user2Name}'s pfp`}
          className="object-cover h-full w-full"
        />
      </div>

      <h1
        className={`text-xl font-bold capitalize transition-all duration-300 overflow-hidden ${
          isActive ? "opacity-100 max-w-[200px] ml-2" : "opacity-0 max-w-0"
        }`}
      >
        {user2Name}
      </h1>
    </Button>
  );
}

function CreateRec() {
  const createUserInpt = useRef<HTMLInputElement | null>(null);

  const createRecommendation = async () => {
    //check if empty
    if (createUserInpt.current != null) {
      console.log(createUserInpt.current.value);
      const response = await fetch("/api/create/recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_2_username: createUserInpt.current.value,
        }),
      });

      console.log(response);
    } else {
      console.error("input is null");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer h-[55px] w-[55px] m-2 text-2xl rounded-sm"
        >
          +
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="Username">Username</Label>
              <Input
                ref={createUserInpt}
                id="Username"
                defaultValue=""
                className="col-span-2 h-8"
              />
            </div>
            <Button onClick={createRecommendation}>Create!</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
