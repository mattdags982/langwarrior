"use client";

import { Button, Slider } from "@mui/material";
import { useState, useRef, useEffect } from "react";

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

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue as number;
      setCurrentTime(newValue as number);
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
    <div className="fixed bottom-0 left-0 w-full bg-gray-200 py-4 h-[120px] flex flex-col items-center">
      <div className="gap-4 flex items-center">
        <Button variant="outlined" onClick={rewindAudio}>
          -2
        </Button>
        <Button variant="outlined" onClick={togglePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </div>
      <div className="w-[860px]">
        <Slider
          value={currentTime}
          onChange={handleSliderChange}
          max={duration || 100}
        />
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
