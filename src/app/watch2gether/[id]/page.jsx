import React from "react";
// import CreateLive from "../../../component/CreateLive/CreateLive";
// import LivePage from "../../../component/LivePage/LivePage";
import axios from "axios";
import * as cheerio from "cheerio";
import WatchLive from "@/component/WatchLive/WatchLive";
import { MongoClient } from "mongodb";

export default async function page({ params, searchParams }) {
  const searchParam = await searchParams;
  const param = await params;

  const mongoUri =
    "mongodb://root:Imperial_king2004@145.223.118.168:27017/?authSource=admin";
  const dbName = "mydatabase"; // Change the database name as needed
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);
  let data;
  let datal;
  let streams;
  let datajDub = [];
  let datajSub = [];
  let difference;
  let episodes;
  if (searchParam.animeId) {
    const episodesCollection = db.collection("episodesStream");
    const animeCollection = db.collection("animeInfo");

    const existingAnime = await animeCollection.findOne({
      _id: searchParam.animeId,
    });
    console.log("anime data from db", existingAnime);

    data = existingAnime.info;
    let dat;
    dat = existingAnime.episodes;
    episodes = dat;

    // Determine the episode ID
    const epId = dat?.results?.episodes[0]?.id;

    const existingEpisode = await episodesCollection.findOne({ _id: epId });
    streams = existingEpisode.streams;
  } else {
    const animeCollection = db.collection("liveRooms");

    const streamAnime = await animeCollection.findOne({
      id: param.id,
    });
    const str = JSON.stringify(streamAnime);
    const strN = JSON.parse(str);
    datal = strN;

    const dateString = datal?.date; // "Tue Feb 18 2025"
    const timeString = datal?.time; // "22:00"

    // Convert "Tue Feb 18 2025" to "2025-02-18"
    const dateObj = new Date(dateString);
    const formattedDate = dateObj.toISOString().split("T")[0]; // "YYYY-MM-DD"

    // Combine formatted date with time and convert to timestamp
    const startTime = new Date(`${formattedDate}T${timeString}:00Z`).getTime();
    console.log("start", startTime);

    const now = Date.now();
    console.log("now", now);

    const difference = Math.floor((now - startTime) / 1000); // Convert to seconds
    console.log("difference", difference);

    let dubTruth = "";

    if (streamAnime.episodes.dub >= 1) {
      dubTruth = "yes";
    }
    if (dubTruth) {
      try {
        datajDub = streamAnime.streams.dub; // Add existing raw data
      } catch (error) {
        console.error("Error fetching stream data: ", error);
        datajDub = [];
      }
    }

    try {
      datajSub = streamAnime.streams.sub; // Add existing raw data
    } catch (error) {
      console.error("Error fetching stream data: ", error);
      datajSub = [];
    }

    let raw = "";

    if (!datajSub?.results?.streamingLink?.link?.file) {
      try {
        datajSub = streamAnime.streams.raw; // Add existing raw data
        raw = "yes";
      } catch (error) {
        console.error("Error fetching stream data: ", error);
      }
    }
  }

  return (
    <div>
      <WatchLive
        id={param.id}
        data={data}
        datal={datal}
        streams={streams}
        datajDub={datajDub}
        secon={difference}
        datajSub={datajSub}
        animeId={searchParam.animeId}
        episodes={episodes}
      />
    </div>
  );
}
