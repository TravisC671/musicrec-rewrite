import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Recs from "./components/Recs";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddSong from "./components/AddSong";

export default async function Home() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center flex-[1]  gap-4 sm:p-20 sm:pb-4 sm:pt-0 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-2 h-full w-full max-w-6xl row-start-1 items-center sm:items-start ">
        <Recs userId={userId} />
        <div className="w-full h-full border-1 rounded-lg grid grid-rows-[3.25rem_1fr]">
          <div className=" row-start-1 flex flex-row gap-2 p-2 w-1/2 ml-2 pl-0 pr-0 justify-between">
            <AddSong />
          </div>
          <ScrollArea className="row-start-2 m-2 w-1/2 mt-0 rounded-md outline-1"></ScrollArea>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="row-start-2 flex gap-[24px] flex-wrap items-center justify-center">
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/file.svg"
          alt="File icon"
          width={16}
          height={16}
        />
        Learn
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/window.svg"
          alt="Window icon"
          width={16}
          height={16}
        />
        Examples
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/globe.svg"
          alt="Globe icon"
          width={16}
          height={16}
        />
        Go to nextjs.org →
      </a>
    </footer>
  );
}
