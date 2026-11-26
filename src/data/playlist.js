export const PLAYLIST = [
  {
    id: "digits",
    title: "Digits",
    artist: "Young Thug",
    src: "/audio/young-thug-digits.mp3",
    rawFilename: "(9)-Young-Thug---Digits-[OFFICIAL-AUDIO]---YouTube.mp3"
  },
  {
    id: "check",
    title: "Check",
    artist: "Young Thug",
    src: "/audio/young-thug-check.mp3",
    rawFilename: "9_-Young-Thug-Check-_Official-Music-Video_-YouTube.mp3"
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    artist: "Rich Gang ft. Young Thug & Rich Homie Quan",
    src: "/audio/rich-gang-lifestyle.mp3",
    rawFilename: "Rich Gang - Lifestyle (Official Music Video) ft. Young Thug, Rich Homie Quan - RichGangVEVO.mp3"
  },
  {
    id: "best-friend",
    title: "Best Friend",
    artist: "Young Thug",
    src: "/audio/young-thug-best-friend.mp3",
    rawFilename: "Young Thug Best Friend - Young Thug.mp3"
  },
  {
    id: "with-that",
    title: "With That",
    artist: "Young Thug ft. Duke",
    src: "/audio/young-thug-with-that.mp3",
    rawFilename: "Young Thug With That featuring Duke - Young Thug.mp3"
  }
];

/**
 * Returns a random track from the playlist, different from the current one if possible
 */
export function getRandomTrack(currentId = null) {
  if (!PLAYLIST.length) return null;
  const available = currentId ? PLAYLIST.filter(t => t.id !== currentId) : PLAYLIST;
  const list = available.length > 0 ? available : PLAYLIST;
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}
