import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function spotifyUrlToUri(url: string) {

  const match = url.match(/open\.spotify\.com\/(track|album|artist|playlist|episode|show)\/([a-zA-Z0-9]+)(\?[^#]*)?/);
  
  if (match) {
    const type = match[1];
    const id = match[2];
    return `spotify:${type}:${id}`;
  }
  console.log("could not convert to uri", url)
  
  return url;
}