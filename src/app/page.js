import Home from "@/component/Home/Home";
import { MongoClient } from "mongodb";
import React from "react";

export default async function Page() {
  const mongoUri =
    "mongodb://root:Imperial_king2004@145.223.118.168:27017/?authSource=admin";
  const dbName = "mydatabase";
  const homeCollectionName = "animoon-home";
  const animeCollectionName = "animeInfo";

  const client = new MongoClient(mongoUri);
  let data;
  let existingAnime = [];

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    // Fetch homepage data
    const homeCollection = db.collection(homeCollectionName.trim());
    const document = await homeCollection.findOne(
      {},
      { maxTimeMS: 1000, noCursorTimeout: true }
    ); // Adjust query as needed

    if (document) {
      data = document;
    } else {
      console.log("No homepage data found in MongoDB");
    }

    // If homepage data is missing, fetch from API
    // if (!data) {
    //   const res = await fetch("https://vimal.animoon.me/api/",{cache: 'no-store'});
    //   data = await res.json();
    // }

    // Check if anime from spotlights exists in the animeInfo collection
    if (data?.spotlights?.length > 0) {
      const animeCollection = db.collection(animeCollectionName.trim());

      // Use Promise.all to fetch data for all spotlight IDs concurrently
      existingAnime = await Promise.all(
        data.spotlights.map(async (spotlight) => {
          const result = await animeCollection.findOne(
            { _id: spotlight.id },
            {
              projection: {
                "info.results.data.animeInfo.Genres": 1,
                "info.results.data.poster": 1,
              },
            }
          );

          if (result) {
            return {
              Genres: result.info?.results?.data?.animeInfo?.Genres || [],
              poster: result.info?.results?.data?.poster || "",
            };
          } else {
            console.log(`Anime ${spotlight.title} not found in database.`);
            return null;
          }
        })
      );

      // Filter out any null results
      existingAnime = existingAnime.filter((item) => item !== null);
    }
  } catch (error) {
    console.error("Error fetching data from MongoDB or API:", error.message);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }

  // Safely pass the structured data to your components
  return (
    <div>
      <Home data={data} existingAnime={existingAnime} />
    </div>
  );
}
