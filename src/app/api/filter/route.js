import { MongoClient } from "mongodb";

const mongoUri =
  "mongodb://root:Imperial_king2004@145.223.118.168:27017/?authSource=admin";
const dbName = "mydatabase"; // Your MongoDB database name

async function getFilteredAnime(filters) {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const animeCollection = db.collection("animeInfo");

    // Build the filter query based on the provided filters
    let query = {};

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
    if (filters.genres && filters.genres.length > 0) {
      const modifiedGenres = filters.genres.map((genre) =>
        genre.replaceAll(" ", "-")
      );
      query["info.results.data.animeInfo.Genres"] = { $in: modifiedGenres };
    }
    

    // Date filtering
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

    // Add a condition to ensure this only applies to date fields and not other strings (like IDs or titles)

    if (filters.startDate || filters.endDate) {
      query["info.results.data.animeInfo.Aired"] = {};
      if (filters.startDate) {
        query["info.results.data.animeInfo.Aired"]["$gte"] = filters.startDate;
      }
      if (filters.endDate) {
        query["info.results.data.animeInfo.Aired"]["$lte"] = filters.endDate;
      }
    }

    // Sorting
    let sortOptions = {};
    if (filters.sort) {
      if (filters.sort === "Score") {
        sortOptions["MAL_Score"] = -1; // Sorting in descending order
      } else if (filters.sort === "Name A-Z") {
        sortOptions["info.results.data.title"] = 1; // Sorting in ascending order (A-Z)
      }
    }

    // MongoDB aggregation to filter out "?" and convert the score to a numbe

    const filteredAnimes = await animeCollection
      .find(query)
      .sort(sortOptions)
      .limit(5)
      .toArray();

    return filteredAnimes;
  } finally {
    await client.close();
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      type: searchParams.get("type"),
      status: searchParams.get("status"),
      rating: searchParams.get("rating"),
      score: searchParams.get("score"),
      season: searchParams.get("season"),
      language: searchParams.get("language"),
      genres: searchParams.getAll("genre"),
      sY: searchParams.get("sY"),
      sM: searchParams.get("sM"),
      sD: searchParams.get("sD"),
      eY: searchParams.get("eY"),
      eM: searchParams.get("eM"),
      eD: searchParams.get("eD"),
      sort: searchParams.get("sort"),
    };

    const filteredAnimes = await getFilteredAnime(filters);
    console.log(filteredAnimes);
    return new Response(JSON.stringify(filteredAnimes), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch filtered anime", { status: 500 });
  }
}
