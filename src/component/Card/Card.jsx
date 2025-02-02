"use client";
import React, { useEffect, useState } from "react";
import "./card.css";
import Link from "next/link";
import MouseOverCard from "./MouseOverCard";
import { FaClosedCaptioning, FaPlayCircle } from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import Image from "next/image";

export default function Card({
  data,
  collectionName,
  IsLoading,
  keepIt,
  itsMe,
  selectL,
  datr,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { id, name, poster, rating, episodes, duration, Secds, epNo } =
    data || {};
  const totalSeconds = duration || 0;
  const totalSecondsTimo = Secds || 0;

  const formatTime = (total) => {
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const percentage = totalSecondsTimo
    ? (totalSecondsTimo / totalSeconds) * 100
    : 0;

  const handleNavigation = () => {
  };

  if (datr === "yes") {
    data = data.info.results.data;
  }

  const title = selectL === "en" ? data.title : data.japanese_title;

  return (
    <div
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      className="anime-card-wrapper"
    >
      <Link
        href={`${
          collectionName !== "Top Upcoming"
            ? `/watch/${data.id}`
            : `/${data.id}`
        }`}
        // prefetch
        onClick={handleNavigation}
        className="anime-card d-flex"
      >
        <div className="anime-card-img-wrapper">
          {screenWidth > 1150 && isHovered && (
            <div className="img-blur d-flex a-center j-center">
              <FaPlayCircle color="white" size={70} />
            </div>
          )}
          {data.adultContent && (
            <span className="rating">
              {datr === "yes"
                ? data?.animeInfo?.tvInfo?.rating?.includes("R")
                  ? "18+"
                  : ""
                : data?.adultContent
                ? "18+"
                : ""}
            </span>
          )}
          <div className="tick-item">
            <span
              className={`episode-count ${
                datr === "yes"
                  ? data?.animeInfo?.tvInfo?.dub
                  : data.tvInfo?.dub
                  ? "extra-epi-co"
                  : ""
              }`}
            >
              <FaClosedCaptioning size={14} />{" "}
              {datr === "yes" ? data?.animeInfo?.tvInfo?.sub : data.tvInfo?.sub}
            </span>
            {datr === "yes"
              ? data?.animeInfo?.tvInfo?.dub > 0
              : data.tvInfo?.dub > 0 && (
                  <span className="episode-count-dub d-flex a-center j-center">
                    <AiFillAudio size={14} />{" "}
                    {datr === "yes"
                      ? data?.animeInfo?.tvInfo?.dub
                      : data.tvInfo?.dub || "?"}
                  </span>
                )}
          </div>
          <img src={data.poster} alt="anime-card" className="anime-card-img" />
        </div>
        <div className="card-details">
          <span className="card-title">
            {title?.length > 15 ? `${title.slice(0, 15)}...` : title}
          </span>
          {keepIt ? (
            <div className="card-statK">
              <div className="timoInfo">
                <div className="epnt">
                  <div>EP</div>
                  <div>{epNo}</div>
                </div>
                <div className="durnt">
                  <div className="durntS">{formatTime(totalSecondsTimo)}</div>
                  <div className="durntM">/</div>
                  <div className="durntL">{formatTime(totalSeconds)}</div>
                </div>
              </div>
              <div className="scaling">
                <div
                  className="inlino"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="card-statistics">
              <span>
                {datr === "yes"
                  ? data?.animeInfo?.tvInfo?.duration
                  : data.tvInfo?.duration || "23m"}
              </span>
              <div className="dot">&#x2022;</div>
              <span>
                {datr === "yes"
                  ? data?.animeInfo?.tvInfo?.showtype
                  : data.tvInfo?.showtype || "TV"}
              </span>
            </div>
          )}
        </div>
      </Link>
      {screenWidth > 1150 && isHovered && data && (
        <MouseOverCard data={data} id={data.data_id} />
      )}
    </div>
  );
}
