import GenreSidebar from "@/component/Gridle/page";
import React from "react";

export async function generateMetadata({ searchParams }) {
  const searchParam = await searchParams;
  const idd = searchParam.name || "Anime"; // Default fallback for name

  return {
    title: `Watch ${idd} Anime English Sub/Dub online free on Animoon.me`,
    description: `Animoon is the best site to watch ${idd} Anime SUB online, or you can even watch ${idd} Anime DUB in HD quality. You can also watch underrated anime on Animoon website.`,
  };
}

export default async function page({ searchParams }) {
  const searchParam = await searchParams;
  const cate = searchParam.name?.toString() || "default-category"; // Ensure cate has a value
  const date = cate
    .replaceAll(" ", "-")
    .toLocaleLowerCase()
    .replace(/[^a-zA-Z0-9\-]/g, ""); // Clean up the category name for URL

  const pageParam = searchParam.page ? searchParam.page : "1";
  const cacheMaxAge = 345600; // Cache for 4 days (in seconds)

  try {
    // Fetch genre-specific anime list and homepage data concurrently
    const animeResp = await fetch(
      `https://vimal.animoon.me/api/genre/${date}?page=${pageParam}`,
      {
        next: { revalidate: 3600 },
      }
    );

    // Fetch data from the API route
    const res = await fetch(`https://homio.animoon.me/api/home`, {
      cache: "no-store",
    });

    // Check if the request was successful
    if (!res.ok) {
      console.error("Failed to fetch data");
      return;
    }

    const { data, existingAnime } = await res.json();

    if (!animeResp.ok) {
      throw new Error("Failed to fetch data.");
    }

    const datai = await animeResp.json();

    // Constructing the shareable URL
    const ShareUrl = `https://animoon.me/genre?id=${cate}&name=${cate}`;
    const arise = `${cate} Anime`;

    return (
      <div>
        <GenreSidebar
          data={datai}
          name={cate}
          cate={cate}
          datal={data}
          genre={'yes'}
          ShareUrl={ShareUrl}
          page={pageParam}
          arise={arise}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data: ", error);
    return <div>Error loading data. Please try again later.</div>;
  }
}
