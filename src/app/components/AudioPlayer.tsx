"use client";

import { useState, useRef, useEffect } from "react";
import { PlayIcon, PauseIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";


type AudioPlayerProps = {
  audioSrc: string;
};

export default function AudioPlayer({ audioSrc }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);

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
    <div className="fixed bottom-0 left-0 w-full bg-gray-200 py-4 pb-8 sm:pt-6 sm:pb-6 h-30">
      <div className="gap-4 flex items-center justify-center">
        <input
          type="range"
          value={currentTime}
          onChange={handleSliderChange}
          max={duration || 100}
          className="w-1/2"
        />
        <button
          onClick={rewindAudio}
        >
          <ArrowUturnLeftIcon className="h-6 w-6"/>
        </button>
        <button
          onClick={togglePlayPause}
        >
          {isPlaying ? <PauseIcon className="h-6 w-6 sm:h-8 sm:w-8"/> : <PlayIcon className="h-6 w-6 sm:h-8 sm:w-8"/>}
        </button>
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
