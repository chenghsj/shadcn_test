"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { createFFmpeg } from "@ffmpeg/ffmpeg";

import { getThumbnails } from "@/utils/getThumbnails";
import { getAudioWaveform } from "@/utils/getAudioWaveform";

const timelineWidth = 500;
let currentTimeID;

export default function Video() {
  const ffmpegRef = useRef(
    createFFmpeg({
      log: true,
      corePath: `${window.location.origin}/ffmpeg-core/dist/ffmpeg-core.js`,
    })
  );

  const videoEl = useRef(null);
  const [videoSrc, setVideoSrc] = useState("");
  const [uploadFile, setUploadFile] = useState();
  const [audioWaveform, setAudioWaveform] = useState();
  const [thumbnails, setThumbnails] = useState([]);
  const [play, setPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [posX, setPosX] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (play) {
      currentTimeID = setInterval(function () {
        setCurrentTime(Math.round(videoEl.current?.currentTime * 100) / 100);
      }, 100);
    }
    return () => clearInterval(currentTimeID);
  }, [play]);

  useEffect(() => {
    const runFFmpeg = async () => {
      setThumbnails(await getThumbnails(ffmpegRef.current, uploadFile?.name, uploadFile, duration));
      setAudioWaveform(await getAudioWaveform(ffmpegRef.current, uploadFile?.name, uploadFile));
    };
    if (uploadFile && duration) {
      runFFmpeg();
    }
  }, [duration, uploadFile]);

  const handleLoadedMetadata = () => {
    const video = videoEl.current;
    if (!video) return;
    setDuration(video.duration);
    console.log(`The video is ${video.duration.toFixed(1)} seconds long.`);
  };

  const handleVideoEnded = () => {
    handleReplayClick();
  };

  const handleOnChange = async (e) => {
    setThumbnails([]);
    // setFiles((e.target as HTMLInputElement).files);
    let file = e.target.files[0];
    setVideoSrc(URL.createObjectURL(file));
    setUploadFile(file);
  };

  const handlePlayClick = () => {
    setPlay(!play);
    if (!play) {
      videoEl.current?.play();
    } else {
      videoEl.current?.pause();
    }
  };

  const handlePauseClick = () => {
    setPlay(false);
    videoEl.current?.pause();
    console.log(videoEl.current?.currentTime);
  };

  const handleReplayClick = () => {
    handlePauseClick();
    setPlay(false);
    setCurrentTime(0);
    setPosX(0);
    // videoEl.current?.currentTime = 0;
    console.log(posX);
  };
  const customImgLoader = (img) => console.log(img.naturalWidth);
  return (
    <div className="App">
      <video
        width="480"
        src={videoSrc}
        ref={videoEl}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnded}
        controls></video>
      <br />
      <p>Time: {currentTime} s</p>
      <button disabled={!videoSrc} onClick={handlePlayClick}>
        {!play ? "Play" : "Pause"}
      </button>
      <button onClick={handleReplayClick}>Replay</button>
      <br />
      <input type="file" accept="video/*" onChange={handleOnChange} />

      {videoSrc && (
        <div className="flex flex-wrap">
          <div
            className="flex box-content"
            style={{
              width: `${timelineWidth}px`,
              height: "50px",
              border: "3px solid gray",
            }}>
            {thumbnails.map((thumbnail, index) => (
              <Image src={thumbnail} key={index} alt="thumbnail" width={50} height={50} />
            ))}
          </div>

          <Image src={audioWaveform} alt="audio waveform" width={timelineWidth} height={50} />
        </div>
      )}
    </div>
  );
}
