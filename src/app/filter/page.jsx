import FilterComp from "@/component/FilterComp/FilterComp";
import React from "react";
import "./filterpage.css";
import { MongoClient } from "mongodb";

// MongoDB connection details
const mongoUri =
  "mongodb://root:Imperial_king2004@145.223.118.168:27017/?authSource=admin";
const dbName = "mydatabase";

// Normalization function for strings
function normalizeString(str) {
  return str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

// Function to fetch filtered anime from MongoDB
async function getFilteredAnime(filters) {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const animeCollection = db.collection("animeInfo");

    let query = {};

    // Apply filter conditions for each parameter
    if (filters.type && filters.type !== "All") {
      query["info.results.data.showType"] = filters.type;
    }
    if (filters.status && filters.status !== "All") {
      query["info.results.data.animeInfo.Status"] = filters.status.replaceAll(
        " ",
        "-"
      );
    }
    if (filters.rating && filters.rating !== "All") {
      query["info.results.data.animeInfo.tvInfo.rating"] = filters.rating;
    }
    if (filters.score && filters.score !== "All") {
      const numericScore = parseInt(filters.score.match(/\d+/)[0], 10);
      if (!isNaN(numericScore)) {
        query["info.results.data.animeInfo.MAL Score"] = {
          $regex: `^${numericScore}`,
        };
      }
    }
    if (filters.season && filters.season !== "All") {
      query["info.results.data.animeInfo.Premiered"] = {
        $regex: filters.season,
        $options: "i",
      };
    }
    if (filters.language && filters.language !== "All") {
      const languages = filters.language.toLowerCase().split(" & ");
      if (languages.includes("sub") && languages.includes("dub")) {
        query["info.results.data.animeInfo.tvInfo.sub"] = { $exists: true };
        query["info.results.data.animeInfo.tvInfo.dub"] = { $exists: true };
      } else {
        if (languages.includes("sub")) {
          query["info.results.data.animeInfo.tvInfo.sub"] = { $exists: true };
        }
        if (languages.includes("dub")) {
          query["info.results.data.animeInfo.tvInfo.dub"] = { $exists: true };
        }
      }
    }

    // Handle multiple genres from the URL
    if (filters.genres && filters.genres.length > 0) {
      const modifiedGenres = filters.genres
        .map((genre) =>
          typeof genre === "string" ? genre.replace(/ /g, "-") : ""
        )
        .filter(Boolean); // Remove empty values
      query["info.results.data.animeInfo.Genres"] = { $all: modifiedGenres };
    }

    if (filters.sY) {
      query["startDate.year"] = filters.sY;
    }

    if (filters.eY) {
      query["endDate.year"] = filters.eY;
    }

    if (filters.sM) {
      query["startDate.month"] = filters.sM;
    }

    if (filters.eM) {
      query["endDate.month"] = filters.eM;
    }

    if (filters.sD) {
      query["startDate.day"] = filters.sD;
    }

    if (filters.eD) {
      query["endDate.day"] = filters.eD;
    }

    // Handle keyword search
    if (filters.keyword) {
      const keyword = filters.keyword;
      query.$or = [
        { "info.results.data.title": { $regex: keyword, $options: "i" } },
        {
          "info.results.data.japanese_title": {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    // Sorting options
    let sortOptions = {};
    if (filters.sort) {
      if (filters.sort === "Score") {
        sortOptions["MAL_Score"] = -1;
      } else if (filters.sort === "Name A-Z") {
        sortOptions["info.results.data.title"] = 1;
      }
    }

    // Fetch filtered data from MongoDB
    const page = parseInt(filters.page) || 1; // Default to page 1 if no page is specified
    const limit = 36; // Items per page
    const skip = (page - 1) * limit; // Skip the correct number of items
    console.log(skip)

    const totalDocs = await animeCollection.countDocuments(query);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalDocs / limit);

    const filteredAnimes = await animeCollection
      .find(query)
      .project({ "info.results.data": 1, _id: 0 })
      .sort(sortOptions)
      .skip(skip) // Skip the first `skip` documents
      .limit(limit) // Limit to `limit` documents
      .toArray();
    return {
      totalDocs, // Total number of matching documents
      totalPages, // Total number of pages
      filteredAnimes, // Documents for the current page
    };
  } finally {
    await client.close();
  }
}

// Main page function
export default async function page({ searchParams }) {
  const searchParam = await searchParams;
  const mongoUri =
    "mongodb://root:Imperial_king2004@145.223.118.168:27017/?authSource=admin";
  const dbName = "mydatabase";
  const homeCollectionName = "animoon-home";

  const client = new MongoClient(mongoUri);
  let data;

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    // Fetch homepage data
    const homeCollection = db.collection(homeCollectionName.trim());
    const document = await homeCollection.findOne({}); // Adjust query as needed

    if (document) {
      data = document;
    } else {
      console.log("No homepage data found in MongoDB");
    }

    // If homepage data is missing, fetch from API
    if (!data) {
      const res = await fetch("https://vimal.animoon.me/api/");
      data = await res.json();
    }
  } catch (error) {
    console.error("Error fetching data from MongoDB or API:", error.message);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }

  // Extract filters from searchParams
  const filters = {
    type: searchParam?.type || "All",
    status: searchParam?.status || "All",
    rating: searchParam?.rating || "All",
    score: searchParam?.score || "All",
    season: searchParam?.season || "All",
    language: searchParam?.language || "All",
    // Capture multiple genres if present in the URL
    genres: Array.isArray(searchParam.genre)
      ? searchParam.genre.map((g) => g.replace(/ /g, "-"))
      : searchParam?.genre
      ? [searchParam.genre.replace(/ /g, "-")]
      : [],
    sY: searchParam.sY,
    sM: searchParam.sM,
    sD: searchParam.sD,
    eY: searchParam.eY,
    eM: searchParam.eM,
    eD: searchParam.eD,
    keyword: searchParam?.keyword || "",
    sort: searchParam?.sort || "",
    page: searchParam.page,
  };

  // Fetch filtered anime
  let filteredAnimes = await getFilteredAnime(filters);
  filteredAnimes = JSON.parse(JSON.stringify(filteredAnimes)); // Ensure a clean data object
  let totalPages = filteredAnimes.totalPages;
  console.log("totalPages", totalPages);

  let totalDocs = filteredAnimes.totalDocs;
  console.log("totalDocs", totalDocs);

  filteredAnimes = filteredAnimes.filteredAnimes;

  return (
    <div className="flirt">
      <FilterComp
        data={data}
        filteredAnimes={filteredAnimes}
        page={searchParam.page}
        totalPages={totalPages}
        totalDocs={totalDocs}
      />
    </div>
  );
}
