"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AddSong() {
  const [isActive, setActive] = useState(true);
  return (
    <>
      <Button
        onClick={() => setActive(!isActive)}
        className={`${
          !isActive ? "w-40" : "w-16"
        } cursor-pointer transition-all duration-300 ease-in-out`}
      >
        {!isActive ? "Recommend Song" : "Cancel"}
      </Button>
      <Input
        placeholder="Paste Spotify Url"
        className={`
            transition-all duration-300 ease-in-out
            bg-white border border-gray-300 px-3 py-1
            ${isActive ? "w-full opacity-100" : "w-0 opacity-0"} overflow-hidden
          `}
      />
      <Button
        className={`
            transition-all duration-300 ease-in-out
            bg-white border border-gray-300 px-3 py-1 w-fit 
            ${isActive ? "opacity-100" : "opacity-0"} overflow-hidden
          `}
      >
        Send
      </Button>
    </>
  );
}
