"use client";

import { useState, useRef, useEffect } from "react";
import { PlayIcon, PauseIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";


const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

type AudioPlayerProps = {
  audioId: string;
};

export default function AudioPlayer({ audioId }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const audioSrc = `https://res.cloudinary.com/${cloudName}/video/upload/${audioId}.mp3`;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayPause = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    } else if (audioRef.current) {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const rewindAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 2;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(event.target.value);
      setCurrentTime(Number(event.target.value));
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    const updateCurrentTime = () => {
      if (audio) setCurrentTime(audio.currentTime);
    };

    if (audio) {
      audio.addEventListener("timeupdate", updateCurrentTime);
      setDuration(audio.duration);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateCurrentTime);
      }
    };
  }, []);
 
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-4 shadow-lg">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center space-x-6">
          {/* Progress and Time Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-slate-300 px-1 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{duration ? formatTime(duration) : '--:--'}</span>
            </div>
            <div className="relative h-1 group">
              <input
                type="range"
                value={currentTime}
                onChange={handleSliderChange}
                max={duration || 100}
                className="absolute w-full h-1 appearance-none bg-slate-700 rounded-full overflow-hidden cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-blue-400
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-white
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:duration-150
                  group-hover:[&::-webkit-slider-thumb]:scale-125"
                style={{
                  background: `linear-gradient(to right, #60A5FA ${(currentTime / (duration || 100)) * 100}%, #1F2937 ${(currentTime / (duration || 100)) * 100}%)`
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={rewindAudio}
              className="text-slate-300 hover:text-white transition-colors duration-200 p-2 hover:bg-slate-800/50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <ArrowUturnLeftIcon className="h-5 w-5"/>
            </button>
            <button
              onClick={togglePlayPause}
              className="text-white bg-blue-500 hover:bg-blue-600 transition-all duration-200 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {isPlaying ? 
                <PauseIcon className="h-6 w-6"/> : 
                <PlayIcon className="h-6 w-6 ml-0.5"/>
              }
            </button>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        src={audioSrc}
      />
    </div>
  );
}
