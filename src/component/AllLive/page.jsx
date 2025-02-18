"use client";
import React, { useEffect, useState } from "react";
import "./all.css";
import { FaThLarge } from "react-icons/fa";

const Page = () => {
  const [cachedData, setCachedData] = useState([]); // State to store fetched data

  const fetchAllDocs = async () => {
    try {
      const response = await fetch("/api/liveRoom"); // Call API to get data
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setCachedData(data);
      console.log("Fetched data:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllDocs();
  }, []);

  const getTimeDifference = (ko) => {
    if (!ko?.createTime) return "N/A";

    const createdTime = new Date(ko.createTime).getTime(); // Convert ISO string to timestamp
    const currentTime = Date.now();
    const difference = currentTime - createdTime;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  };

  return (
    <div className="fate-l">
      <div className="found-al">
        <div>
          <div className="topi-l">
            <div className="opt-1">Home</div>
            <div className="opt-2">&#x2022;</div>
            <div className="opt-3">Watch together</div>
          </div>
          <div className="topi-2">
            <div className="hed-1">Browse</div>
            <div className="topi-l">
              <div className="emir">All</div>
              <div className="emir">On-air</div>
              <div className="emir">Scheduled</div>
              <div className="emir">Waiting</div>
              <div className="emir">Ended</div>
              <div className="kirt">
                <FaThLarge />
                <div>My Rooms</div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Data */}
        <div className="found-l">
          {cachedData.length > 0 ? (
            cachedData.map((ko, index) => (
              <div className="koil" key={index}>
                <div className="container">
                  <div className="background">
                    <img src={ko.poster} alt="Poster" />
                  </div>
                  <div className="overlay"></div>
                  <div className="content">
                    <div className="tag">
                      <div className="epol">{ko.sub ? "SUB" : "DUB"}</div>
                    </div>
                    <img className="poster" src={ko.poster} alt="Poster" />
                    <div className="episode">
                      <div className="epoy">{ko.episode || "N/A"}</div>
                    </div>
                  </div>
                </div>
                <div className="sec-apt">
                  <div>
                    <img
                      className="rando"
                      src={ko.randomImage}
                      alt="Random"
                      style={{ maxWidth: "100px" }}
                    />
                  </div>
                  <div className="mid0">
                    <div className="an-name">{ko.name || "No Room Name"}</div>
                    <div className="rn-name">
                      {ko.roomName || "No Room Name"}
                    </div>
                    <div className="bott-G">
                      <div className="ott-1">{ko.userName || "Anonymous"}</div>
                      <div className="ott-2">&#x2022;</div>
                      <div className="ott-3">{getTimeDifference(ko)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Loading or No Data Found...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
