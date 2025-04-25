"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

export default function AddSong() {
  const [isActive, setActive] = useState(true);

  const urlRef = useRef<HTMLInputElement | null>(null)

  const fetchSong = async () => {

    if (urlRef.current == null) {
      return
    }

    const res = await fetch('/api/create/song', {
      method: 'POST',
      body: JSON.stringify({ url: urlRef.current.value }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    //TODO check if data is valid
    setActive(false)
    urlRef.current.value = ""
    console.log(data)
  };

  return (
    <>
      <Button
        onClick={() => setActive(!isActive)}
        className={`${!isActive ? "w-40" : "w-16"
          } cursor-pointer transition-all duration-300 ease-in-out`}
      >
        {!isActive ? "Recommend Song" : "Cancel"}
      </Button>
      <Input
        ref={urlRef}
        placeholder="Paste Spotify Url"
        className={`
            transition-all duration-300 ease-in-out
            bg-white border border-gray-300 px-3 py-1
            ${isActive ? "w-full opacity-100" : "w-0 opacity-0"} overflow-hidden
          `}
      />
      <Button onClick={fetchSong}
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
