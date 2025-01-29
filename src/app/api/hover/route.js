import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Ensure you have this set in your .env file
const dbName = "mydatabase"; // Your database name
const collectionName = "animeInfo"; // Your collection name

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Check if 'id' query parameter is provided
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Connect to MongoDB
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch data using the 'id'
    const data = await collection.findOne(
      { _id: id },
      { projection: { "info.results.data": 1, _id: 0 } }
    );

    // Close the database connection
    await client.close();

    // Check if data exists
    if (!data) {
      return new Response(JSON.stringify({ error: "Data not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the fetched data
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
