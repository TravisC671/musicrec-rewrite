"use client";
import supabase from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import CreateRec from "./CreateRec";
import { Button } from "@/components/ui/button";

type RecsType = {
  userId: string;
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
export default function Recs({ userId }: RecsType) {
  const [recs, setRecs] = useState<RecordTbType[]>([]);

  useEffect(() => {
    const fetchRecs = async () => {
      const { data, error } = await supabase
        .from("Recommendations")
        .select()
        .or(`user_1_clerk_id.eq.${userId},user_2_clerk_id.eq.${userId}`);

      console.log(data);
      //kinda jank
      setRecs(data as RecordTbType[]);
    };

    fetchRecs();
  }, []);

  return (
    <div className="w-full h-16 flex gap-2">
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
          isActive={false}
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
};
function RecBtn({ recId, img, user2Name, isActive }: RecBtnType) {
  return (
    <Button
      className="h-16 min-w-16 p-0 duration-200 bottom-0 relative hover:bottom-[5px]"
      variant={"ghost"}
    >
      <div className="h-16 w-16 overflow-hidden rounded-[4px]">
        <img src={img} alt={`${user2Name}'s pfp`} className="object-cover" />
      </div>

      {isActive ?? <h1>{user2Name}</h1>}
    </Button>
  );
}
