"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRef } from "react";

export default function CreateRec() {
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
