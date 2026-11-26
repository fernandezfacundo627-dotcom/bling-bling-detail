import React, { useState } from 'react';
import { Music, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const PLAYLIST_ID = "23GTQwwaCR2kMtpcH9yDda";
const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`;
const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;

export default function SpotifyPlayer() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto mb-3">
      {isCollapsed ? (
        /* Collapsed Minimalist Bar */
        <div 
          onClick={() => setIsCollapsed(false)}
          className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-[#121215] border border-white/[0.08] shadow-md cursor-pointer hover:border-white/20 transition group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#1DB954]/15 border border-[#1DB954]/30 flex items-center justify-center">
              <Music className="w-3.5 h-3.5 text-[#1DB954]" strokeWidth={2} />
            </div>
            <div>
              <span className="text-xs font-semibold text-white">Playlist Spotify</span>
              <span className="text-[10px] text-zinc-400 block -mt-0.5">Toca para abrir reproductor</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20">
              Spotify
            </span>
            <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-white transition" />
          </div>
        </div>
      ) : (
        /* Full Spotify Player Card */
        <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-3 shadow-lg transition-all">
          {/* Header row */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#1DB954]/20 flex items-center justify-center">
                <Music className="w-3 h-3 text-[#1DB954]" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold text-white tracking-tight">Bling Bling Playlist</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1DB954]/10 text-[#1DB954] font-semibold border border-[#1DB954]/20">
                Spotify
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={SPOTIFY_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition"
                title="Abrir en app de Spotify"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setIsCollapsed(true)}
                className="w-6 h-6 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition"
                title="Minimizar reproductor"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Spotify Official IFrame Embed */}
          <div className="w-full rounded-xl overflow-hidden bg-black/40 shadow-inner">
            <iframe
              src={SPOTIFY_EMBED_URL}
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Web Player"
              className="rounded-xl border-0 block"
            />
          </div>
        </div>
      )}
    </div>
  );
}
