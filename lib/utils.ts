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

export function getVideoUrlHost(url: string) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return "Youtube"
  }

  if (url.includes('vimeo.com')) {
    return "Vimeo"
  }

  return "Unknow"
}

export function isValidImageUrl(url: string) {
  if (url.endsWith('.png') || url.endsWith('.jpg')) {
    return true
  }

  return false
}

export function makeVideoEmbed(url: string, host: "Youtube" | "Vimeo" | "Unknow") {
  if (host == "Unknow") return null
  const id = host == "Youtube" ? url.replace("https://www.youtube.com/watch?v=", "") : url.replace("https://vimeo.com/", "")
  if (id.length < 1) return null
  const newLink = host == "Youtube" ? "https://www.youtube.com/embed/"+id : "https://player.vimeo.com/video/"+id
  return newLink
}