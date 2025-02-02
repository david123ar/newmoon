"use client";
import React, { useState } from "react";
import "./filterComp.css";
import AnimeCollection from "../MainContainer/AnimeCollection";
import Genre from "../Genre/Genre";
import TopTenAnime from "../TopTen/TopTenAnime";
import Navbar from "../Navbar/Navbar";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import Profilo from "../Profilo/Profilo";
import { SessionProvider } from "next-auth/react";
import Footer from "../Footer/Footer";

const FilterComp = (props) => {
  const [filters, setFilters] = useState({
    type: "All",
    status: "All",
    rating: "All",
    score: "All",
    season: "All",
    language: "All",
    genres: [],
    startDateYear: "",
    startDateMonth: "",
    startDateDay: "",
    endDateYear: "",
    endDateMonth: "",
    endDateDay: "",
    sort: "Default",
  });

  const genArr = [
    "Action",
    "Adventure",
    "Cars",
    "Comedy",
    "Dementia",
    "Demons",
    "Drama",
    "Ecchi",
    "Fantasy",
    "Game",
    "Harem",
    "Historical",
    "Horror",
    "Isekai",
    "Josei",
    "Kids",
    "Magic",
    "Martial Arts",
    "Mecha",
    "Military",
    "Music",
    "Mystery",
    "Parody",
    "Police",
    "Psychological",
    "Romance",
    "Samurai",
    "School",
    "Sci-Fi",
    "Seinen",
    "Shoujo",
    "Shoujo Ai",
    "Shounen",
    "Shounen Ai",
    "Slice of Life",
    "Space",
    "Sports",
    "Super Power",
    "Supernatural",
    "Thriller",
    "Vampire",
  ];

  const filtersList = [
    {
      label: "Type",
      name: "type",
      values: ["All", "Movie", "TV", "OVA", "ONA", "Special", "Music"],
    },
    {
      label: "Status",
      name: "status",
      values: ["All", "Finished Airing", "Currently Airing", "Not yet aired"],
    },
    {
      label: "Rating",
      name: "rating",
      values: ["All", "G", "PG", "PG-13", "R", "R+", "Rx"],
    },
    {
      label: "Score",
      name: "score",
      values: [
        "All",
        "(1) Appalling",
        "(2) Horrible",
        "(3) Very Bad",
        "(4) Bad",
        "(5) Average",
        "(6) Fine",
        "(7) Good",
        "(8) Very Good",
        "(9) Great",
        "(10) Masterpiece",
      ],
    },
    {
      label: "Season",
      name: "season",
      values: ["All", "Spring", "Summer", "Fall", "Winter"],
    },
    {
      label: "Language",
      name: "language",
      values: ["All", "SUB", "DUB", "SUB & DUB"],
    },
  ];

  const handleGenreClick = (genre) => {
    setFilters((prevState) => {
      const updatedGenres = prevState.genres.includes(genre)
        ? prevState.genres.filter((g) => g !== genre)
        : [...prevState.genres, genre];

      return { ...prevState, genres: updatedGenres };
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle separate date inputs
  const handleStartYearChange = (e) => {
    setFilters((prevState) => ({
      ...prevState,
      startDateYear: e.target.value,
    }));
  };

  const handleStartMonthChange = (e) => {
    setFilters((prevState) => ({
      ...prevState,
      startDateMonth: e.target.value,
    }));
  };

  const handleStartDayChange = (e) => {
    setFilters((prevState) => ({ ...prevState, startDateDay: e.target.value }));
  };

  const handleEndYearChange = (e) => {
    setFilters((prevState) => ({ ...prevState, endDateYear: e.target.value }));
  };

  const handleEndMonthChange = (e) => {
    setFilters((prevState) => ({ ...prevState, endDateMonth: e.target.value }));
  };

  const handleEndDayChange = (e) => {
    setFilters((prevState) => ({ ...prevState, endDateDay: e.target.value }));
  };

  const [filteredData, setFilteredData] = useState("");

  const applyFilters = async () => {
    const queryParams = new URLSearchParams();

    // Type filter
    if (filters.type !== "All") queryParams.append("type", filters.type);

    // Status filter
    if (filters.status !== "All") queryParams.append("status", filters.status);

    // Rating filter
    if (filters.rating !== "All") queryParams.append("rating", filters.rating);

    // Score filter
    if (filters.score !== "All") queryParams.append("score", filters.score);

    // Season filter
    if (filters.season !== "All") queryParams.append("season", filters.season);

    // Language filter
    if (filters.language !== "All")
      queryParams.append("language", filters.language);

    // Genre filters
    if (filters.genres.length > 0) {
      filters.genres.forEach((genre) => queryParams.append("genre", genre));
    }

    // Start date filter
    if (filters.startDateYear) queryParams.append("sY", filters.startDateYear);
    if (filters.startDateMonth)
      queryParams.append("sM", filters.startDateMonth);
    if (filters.startDateDay) queryParams.append("sD", filters.startDateDay);

    // End date filter
    if (filters.endDateYear) queryParams.append("eY", filters.endDateYear);
    if (filters.endDateMonth) queryParams.append("eM", filters.endDateMonth);
    if (filters.endDateDay) queryParams.append("eD", filters.endDateDay);

    // Sort filter
    if (filters.sort !== "Default") queryParams.append("sort", filters.sort);

    // keyword
    if (props.keyword) queryParams.append("keyword", props.keyword);

    const response = await fetch(`/api/filter?${queryParams.toString()}`);
    const filteredAnimes = await response.json();
    console.log(filteredAnimes);
    setFilteredData(filteredAnimes);
  };

  const [selectL, setSelectL] = useState("en");
  const [profiIsOpen, setProfiIsOpen] = useState(false);
  const [logIsOpen, setLogIsOpen] = useState(false);
  const sign = (sign) => {
    setLogIsOpen(sign);
  };

  const lang = (lang) => {
    setSelectL(lang);
  };

  return (
    <>
      <div>
        <SessionProvider>
          <div>
            <Navbar
              lang={lang}
              sign={sign}
              setProfiIsOpen={setProfiIsOpen}
              profiIsOpen={profiIsOpen}
            />
          </div>
          {profiIsOpen ? (
            <div>
              <Profilo
                setProfiIsOpen={setProfiIsOpen}
                profiIsOpen={profiIsOpen}
              />
            </div>
          ) : (
            ""
          )}
          {logIsOpen ? (
            <div>
              <SignInSignUpModal
                logIsOpen={logIsOpen}
                setLogIsOpen={setLogIsOpen}
                sign={sign}
              />
            </div>
          ) : (
            ""
          )}
          <div>
            <div className="filter-container">
              <h2>Filter</h2>

              <div className="filter-row">
                {filtersList.map((filter) => (
                  <div key={filter.label} className="filter-group">
                    <label>{filter.label}</label>
                    <select
                      name={filter.name}
                      value={filters[filter.name]}
                      onChange={handleFilterChange}
                      className="filter-dropdown"
                    >
                      {filter.values.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Date Filters */}
              <div className="filter-row">
                {["startDate", "endDate"].map((dateType) => (
                  <div key={dateType} className="filter-group">
                    <label>
                      {dateType === "startDate" ? "Start Date" : "End Date"}
                    </label>
                    <div className="date-inputs">
                      <select
                        className="date-dropdown"
                        onChange={
                          dateType === "startDate"
                            ? handleStartYearChange
                            : handleEndYearChange
                        }
                      >
                        <option value="">Year</option>
                        {[...Array(50)].map((_, i) => (
                          <option key={i} value={1970 + i}>
                            {1970 + i}
                          </option>
                        ))}
                      </select>
                      <select
                        className="date-dropdown"
                        onChange={
                          dateType === "startDate"
                            ? handleStartMonthChange
                            : handleEndMonthChange
                        }
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <select
                        className="date-dropdown"
                        onChange={
                          dateType === "startDate"
                            ? handleStartDayChange
                            : handleEndDayChange
                        }
                      >
                        <option value="">Day</option>
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sort Option */}
              <div className="filter-row">
                <div className="filter-group">
                  <label>Sort</label>
                  <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="filter-dropdown"
                  >
                    <option value="Default">Default</option>
                    {/* <option value="Recently Added">Recently Added</option>
            <option value="Recently Updated">Recently Updated</option> */}
                    <option value="Score">Score</option>
                    <option value="Name A-Z">Name A-Z</option>
                    {/* <option value="Released Date">Released Date</option>
            <option value="Most Watched">Most Watched</option> */}
                  </select>
                </div>
              </div>

              {/* Genre */}
              <div className="filter-row">
                <label>Genre</label>
                <div className="genres">
                  {genArr.map((gen) => (
                    <span
                      key={gen}
                      className={`genre-item ${
                        filters.genres.includes(gen) ? "selected" : ""
                      }`}
                      onClick={() => handleGenreClick(gen)}
                    >
                      {gen}
                    </span>
                  ))}
                </div>
              </div>

              <button className="filter-button" onClick={applyFilters}>
                Apply Filters
              </button>
            </div>
            <div>
              <div className="main-container jiki d-flex">
                <div className="sidebar-wrapper d-flex-fd-column ">
                  <Genre data={props.data.genres} />
                  <TopTenAnime data={props.data.topTen} selectL={selectL} />
                </div>
                {filteredData && (
                  <div className="collections-wrapper d-flex-fd-column a-center ">
                    <AnimeCollection
                      collectionName="Results..."
                      data={filteredData} // Use recentEpisodesAnime from props
                      filterName="filter"
                      datr={"yes"}
                      selectL={selectL}
                    />{" "}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <Footer />
          </div>
        </SessionProvider>
      </div>
    </>
  );
};

export default FilterComp;
