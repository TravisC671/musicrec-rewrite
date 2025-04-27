"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type SRToggle = {
  Sent: boolean;
};
export default function SRToggle() {
  const [isSent, setSent] = useState(false);
  return (
    <div className="m-[20px] mb-0 flex ">
      <div
        className={`w-28 h-9 bg-primary duration-200 rounded-sm ease-out relative ${
          isSent ? "right-0" : "-right-28"
        } pointer-events-none`}
      ></div>
      <div className="bg-[#10131400] rounded-sm overflow-hidden relative right-[112px]  outline-1 outline-[#2F3B37]">
        <Button
          variant={"blank"}
          className="w-28 hover:bg-none rounded-none"
          onClick={() => setSent(true)}
        >
          <h1
            className={`${
              isSent ? "text-black" : "text-white"
            } duration-200 ease-out font-bold text-base`}
          >
            Sent
          </h1>
        </Button>
        <Button
          variant={"blank"}
          className="w-28 rounded-none"
          onClick={() => setSent(false)}
        >
          <h1
            className={`${
              !isSent ? "text-black" : "text-white"
            } duration-200 ease-out font-bold text-base`}
          >
            Recieved
          </h1>
        </Button>
      </div>
    </div>
  );
}
