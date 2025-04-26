import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Content from "./components/Content";

export default async function Home() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center flex-[1]  gap-4 sm:p-20 sm:pb-4 sm:pt-0 font-[family-name:var(--font-geist-sans)]">
      <Content userId={userId} />
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
