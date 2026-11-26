import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Disc3, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { PLAYLIST, getRandomTrack } from '../data/playlist';

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(() => getRandomTrack());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let started = false;

    // 1. Direct attempt to play unmuted audio immediately
    const forcePlay = () => {
      if (started || !audioRef.current) return;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          started = true;
        })
        .catch(() => {
          // If browser restricts unmuted autoplay, wait for any ambient activity
        });
    };

    forcePlay();

    // 2. Comprehensive ambient triggers: focus, mouse movement, visibility, key, scroll, touch
    const ambientTriggers = [
      'focus', 
      'pointermove', 
      'mousemove', 
      'touchstart', 
      'pointerdown', 
      'keydown', 
      'scroll', 
      'click'
    ];

    const handleAmbientActivity = () => {
      if (!started && audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            started = true;
          })
          .catch(() => {});
      }
    };

    ambientTriggers.forEach((event) => {
      window.addEventListener(event, handleAmbientActivity, { passive: true, capture: true });
      document.addEventListener(event, handleAmbientActivity, { passive: true, capture: true });
    });

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !started) {
        forcePlay();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      ambientTriggers.forEach((event) => {
        window.removeEventListener(event, handleAmbientActivity, { capture: true });
        document.removeEventListener(event, handleAmbientActivity, { capture: true });
      });
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [currentTrack]);

  const changeTrack = (track) => {
    if (!track) return;
    setCurrentTrack(track);

    if (audioRef.current) {
      audioRef.current.src = track.src;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleNext = () => {
    const next = getRandomTrack(currentTrack?.id);
    if (next) {
      changeTrack(next);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log(e));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSongEnded = () => {
    const next = getRandomTrack(currentTrack?.id);
    if (next) {
      changeTrack(next);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-[4.25rem] left-0 right-0 z-30 px-3 max-w-md mx-auto pointer-events-auto">
      {/* Native HTML5 Audio Tag */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        autoPlay
        playsInline
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleSongEnded}
      />

      {isMinimized ? (
        /* Minimized Pill */
        <div 
          onClick={() => setIsMinimized(false)}
          className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#121215]/95 border border-white/[0.08] backdrop-blur-md shadow-lg cursor-pointer hover:border-white/20 transition"
        >
          <div className="flex items-center gap-2 truncate">
            <Disc3 className={`w-3.5 h-3.5 text-emerald-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            <span className="text-[11px] font-medium text-white truncate">
              {currentTrack.artist} - {currentTrack.title}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center justify-center text-white"
            >
              {isPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
            </button>
            <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
          </div>
        </div>
      ) : (
        /* Full Player */
        <div className="relative overflow-hidden rounded-2xl bg-[#121215] border border-white/[0.08] p-3 shadow-md transition-all">
          <div className="flex items-center justify-between gap-2.5">
            {/* Cover / Vinyl */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/[0.1] flex items-center justify-center flex-shrink-0 shadow-inner">
              <Disc3 
                className={`w-5 h-5 text-emerald-400 transition-transform ${isPlaying ? 'animate-spin' : ''}`} 
                style={{ animationDuration: '4s' }} 
              />
              {isPlaying && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#121215] animate-ping" />
              )}
            </div>

            {/* Song & Artist Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Audio
                </span>
                <span className="text-[11px] text-zinc-400 truncate">
                  {currentTrack.artist}
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate mt-0.5">
                {currentTrack.title}
              </p>
            </div>

            {/* Equalizer animation */}
            <div className="flex items-end gap-0.5 h-4 px-1">
              <span className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-150 ${isPlaying ? 'h-3.5 animate-pulse' : 'h-1 opacity-40'}`} />
              <span className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-200 ${isPlaying ? 'h-4 animate-bounce' : 'h-1.5 opacity-40'}`} style={{ animationDelay: '100ms' }} />
              <span className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-150 ${isPlaying ? 'h-2.5 animate-pulse' : 'h-1 opacity-40'}`} style={{ animationDelay: '200ms' }} />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-bold hover:bg-zinc-200 active:scale-95 transition shadow"
                aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>

              {/* Next Track */}
              <button
                onClick={handleNext}
                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white flex items-center justify-center transition"
                title="Siguiente tema aleatorio"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              {/* Mute toggle */}
              <button
                onClick={toggleMute}
                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white flex items-center justify-center transition"
                title={isMuted ? "Activar sonido" : "Silenciar"}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Minimize */}
              <button
                onClick={() => setIsMinimized(true)}
                className="w-6 h-6 rounded-lg text-zinc-500 hover:text-zinc-300 flex items-center justify-center transition"
                title="Minimizar reproductor"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
