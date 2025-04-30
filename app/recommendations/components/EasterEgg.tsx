"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

export default function MatchaEasterEgg() {
  const [typed, setTyped] = useState("");
  const [isDone, setDone] = useState(false);
  const target = "matcha";

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isDone) return;

      setTyped((prev) => {
        const newTyped = (prev + e.key).slice(-target.length); // keep only the last N chars
        if (newTyped === target) {
          console.log("done");
          setDone(true);
        }
        console.log(newTyped);
        return newTyped;
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return <Fren initOpen={isDone} />;
}

function Fren({ initOpen }: { initOpen: boolean }) {
  const [open, setOpen] = useState(initOpen);
  const [curDialogue, setCurDialogue] = useState(-1);

  const dialogue = [
    "Logging into mainframe",
    "Booting up zesty vision",
    "Matcha Reactor",
    "ON",
    "xiao hong",
    "mother frickin",
    "shu",
  ];
  const times = [1666, 2000, 500, 500, 500, 500, 500];

  const audio = new Audio(
    "https://gs261yrzoi.ufs.sh/f/pra1ARSHOHiLPjYL1DF3aHV7gsKXE8Onb9ferM0YdixDmtlA"
  );

  const onClick = () => {
    setCurDialogue(0);
    audio.play();
  };

  useEffect(() => {
    setOpen(initOpen);
    if (curDialogue != -1 && curDialogue != 7) {
      const timer = setTimeout(() => {
        setCurDialogue((prev) => prev + 1);
      }, times[curDialogue]);
    }
    if (curDialogue === 7) {
      setOpen(false);
    }
  }, [curDialogue, initOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="hidden">macha</DialogTitle>
      <DialogContent
        title="macha"
        className={`${curDialogue !== -1 && "w-[1600px] h-[300px]"}`}
      >
        <div
          className={`flex flex-col items-center justify-center h-full w-full text-center `}
        >
          {curDialogue === -1 ? (
            <>
              <img
                src={
                  "https://gs261yrzoi.ufs.sh/f/pra1ARSHOHiLyer3ZH4AJBFlChUvX6sKmkq7uIdnWV4LYPRc"
                }
              />
              <Button className="m-3" onClick={onClick}>
                Start martcha reactor
              </Button>
            </>
          ) : (
            <h1 className={`text-7xl`}>{dialogue[curDialogue]}</h1>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
