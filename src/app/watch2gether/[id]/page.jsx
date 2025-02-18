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

    // Manually extract day, month, and year
    const parts = dateString.split(" "); // ["Tue", "Feb", "18", "2025"]
    const months = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const year = parseInt(parts[3]); // 2025
    const month = months[parts[1]]; // Convert "Feb" to 1
    const day = parseInt(parts[2]); // 18

    const [hours, minutes] = timeString.split(":").map(Number); // [22, 0]

    // Create a UTC timestamp
    const startTime = Date.UTC(year, month, day, hours, minutes, 0);
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
