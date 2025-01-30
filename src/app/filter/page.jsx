import FilterComp from "@/component/FilterComp/FilterComp";
import React from "react";
import "./filterpage.css";
import { MongoClient } from "mongodb";

export default async function page() {
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

    // Check if anime from spotlights exists in the animeInfo collection
  } catch (error) {
    console.error("Error fetching data from MongoDB or API:", error.message);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
  return (
    <div className="flirt">
      <FilterComp data={data}/>
    </div>
  );
}
