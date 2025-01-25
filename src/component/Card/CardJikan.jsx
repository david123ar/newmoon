"use client";
import React, { useEffect, useState } from "react";
import "./card.css";
import Link from "next/link";
import MouseOverCard from "./MouseOverCard";
import { FaClosedCaptioning, FaPlayCircle } from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import Image from "next/image";

export default function Card(props) {
  const anime = props.data;
  const [isHovered, setIsHovered] = useState(false);
  const [screenWidth, setScreenWidth] = useState(null);

  const localStorageWrapper = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      return {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key),
        clear: () => localStorage.clear(),
      };
    } else {
      // Handle the case when localStorage is not available
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
      };
    }
  };

  // Usage
  const ls = localStorageWrapper();

  useEffect(() => {
    // Check if the window object is available before setting the screen width
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth);

      const setWidth = () => {
        setScreenWidth(window.innerWidth);
      };

      window.addEventListener("resize", setWidth);
      return () => window.removeEventListener("resize", setWidth);
    }
  }, []);
  const handleNavigation = () => {
    props.IsLoading(true);
  };

  return (
    <div
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      className="anime-card-wrapper"
    >
      <Link
        href={`${
          props.collectionName !== "Top Upcoming"
            ? ls.getItem(`Rewo-${anime.data_id.replace("/", "")}`)
              ? `/watch/${ls.getItem(`Rewo-${anime.data_id.replace("/", "")}`)}`
              : `/watch${anime.data_id}`
            : `/${anime.data_id}`
        }`}
        prefetch
        onClick={handleNavigation}
        key={anime.data_id}
        className="anime-card d-flex"
      >
        <div className={`anime-card-img-wrapper`}>
          {screenWidth && screenWidth > 1150 && (
            <div
              style={isHovered ? { opacity: 1 } : { opacity: 0 }}
              className="img-blur d-flex a-center j-center trans-03"
            >
              <FaPlayCircle color="white" size={70} />
            </div>
          )}
          {props.keepIt || props.itsMe ? (
            anime.rating.includes("R") ? (
              <span className="rating">
                {anime.rating.includes("R") ? "18+" : ""}
              </span>
            ) : (
              ""
            )
          ) : anime.tvInfo.rating ? (
            <span className="rating">{anime.tvInfo.rating || ""}</span>
          ) : (
            ""
          )}
          <div className="tick-item">
            <span
              className={`episode-count ${
                anime?.tvInfo?.dub > 0 ? "borO" : "borR"
              }`}
            >
              <FaClosedCaptioning size={14} />
              {anime?.tvInfo?.sub || "?"}
            </span>{" "}
            {anime?.tvInfo?.dub > 0 ? (
              <span className="episode-count-dub d-flex a-center j-center">
                <AiFillAudio size={14} />
                {anime?.tvInfo?.dub || "?"}
              </span>
            ) : (
              ""
            )}
          </div>

          <img src={anime.poster} alt="anime-card" className="anime-card-img"/>
        </div>
        <div className="card-details">
          <span className="card-title">
            {anime.title?.length > 15
              ? anime.title?.slice(0, 15) + "..."
              : anime.title}
          </span>
          {props.keepIt ? (
            <div>
              <div className="card-statK">
                <div className="timoInfo">
                  <div className="epnt">
                    <div>EP</div>
                    <div>{anime.epNo}</div>
                  </div>
                  <div className="durnt">
                    <div className="durntS">
                      {(minutestimo < 10
                        ? "0" + minutestimo.toString()
                        : minutestimo.toString()) +
                        ":" +
                        (secondstimo.toFixed(0) < 10
                          ? "0" + secondstimo.toFixed(0).toString()
                          : secondstimo.toFixed(0).toString())}
                    </div>
                    <div className="durntM">/</div>
                    <div className="durntL">
                      {(minutes < 10
                        ? "0" + minutes.toString()
                        : minutes.toString()) +
                        ":" +
                        (seconds.toFixed(0) < 10
                          ? "0" + seconds.toFixed(0).toString()
                          : seconds.toFixed(0).toString())}
                    </div>
                  </div>
                </div>
                <div className="scaling">
                  <div className={`inlino`} style={{ width: percentage }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-statistics">
              <span>
                {anime.tvInfo.duration === "Unknown"
                  ? `?`
                  : anime.tvInfo.duration.length > 7
                  ? anime.tvInfo.duration.slice(0, 7)
                  : anime.tvInfo.duration || "23m"}
              </span>
              <div className="dot"></div>
              <span>{anime.tvInfo.showtype || "TV"}</span>
            </div>
          )}
        </div>
      </Link>
      {screenWidth && screenWidth > 1150 && isHovered && anime && (
        <MouseOverCard id={anime.data_id} />
      )}
    </div>
  );
}
