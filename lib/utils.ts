import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isVideoUrl(url: string) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return true
  }

  if (url.includes('vimeo.com')) {
    return true
  }

  return false
}
