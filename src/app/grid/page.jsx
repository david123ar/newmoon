import GenreSidebar from "@/component/Gridle/page";
import React from "react";

export async function generateMetadata({ searchParams }) {
  const searchParam = await searchParams;
  const idd = searchParam.heading;

  return {
    title: `Watch ${idd} Anime English Sub/Dub online free on Animoon.me`,
    description: `Animoon is the best site to watch ${idd} Anime SUB online, or you can even watch ${idd} Anime DUB in HD quality. You can also watch under rated anime on Animoon website.`,
  };
}

export default async function page({ searchParams }) {
  const searchParam = await searchParams;
  const cate = searchParam.name?.toString() || "default-category"; // Default value fallback
  const fiki = searchParam.heading?.toString() || "Anime"; // Default fallback
  const pageParam = searchParam.page ? searchParam.page : "1";
  const cacheMaxAge = 345600; // Cache for 4 days (in seconds)

  try {
    // Fetch data for category-specific anime list
    const animeResp = await fetch(
      `https://vimal.animoon.me/api/${cate}?page=${pageParam}`,
      {
        next: { revalidate: 3600 },
      }
    );

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
    const ShareUrl = `https://animoon.me/grid?name=${cate}&heading=${fiki}`;
    const arise = `${fiki} Anime`;

    return (
      <div>
        <GenreSidebar
          data={datai}
          fiki={fiki}
          cate={cate}
          datal={data}
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
