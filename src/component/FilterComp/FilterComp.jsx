import React from "react";
import "./filterComp.css";

const FilterComp = () => {
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

  const filters = [
    {
      label: "Type",
      default: "All",
      values: ["Movie", "TV", "OVA", "ONA", "Special", "Music"],
    },
    {
      label: "Status",
      default: "All",
      values: ["Finished Airing", "Currently Airing", "Not yet aired"],
    },
    {
      label: "Related",
      default: "All",
      values: ["G", "PG", "PG-13", "R", "R+", "Rx"],
    },
    {
      label: "Score",
      default: "All",
      values: [
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
      default: "All",
      values: ["Spring", "Summer", "Fall", "Winter"],
    },
    {
      label: "Language",
      default: "All",
      values: ["SUB", "DUB", "SUB & DUB"],
    },
  ];

  return (
    <div className="filter-container">
      <h2>Filter</h2>

      {/* Dynamic Filters */}
      <div className="filter-row">
        {filters.map((filter) => (
          <div key={filter.label} className="filter-group">
            <label>{filter.label}</label>
            <select defaultValue={filter.default} className="filter-dropdown">
              <option value="All">{filter.default}</option>
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
        <div className="filter-group">
          <label>Start Date</label>
          <div className="date-inputs">
            <select className="date-dropdown">
              <option>Year</option>
              {/* Add year options dynamically */}
              {[...Array(50)].map((_, i) => (
                <option key={i} value={1970 + i}>
                  {1970 + i}
                </option>
              ))}
            </select>
            <select className="date-dropdown">
              <option>Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select className="date-dropdown">
              <option>Day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-group">
          <label>End Date</label>
          <div className="date-inputs">
            <select className="date-dropdown">
              <option>Year</option>
              {[...Array(50)].map((_, i) => (
                <option key={i} value={1970 + i}>
                  {1970 + i}
                </option>
              ))}
            </select>
            <select className="date-dropdown">
              <option>Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select className="date-dropdown">
              <option>Day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-group">
          <label>Sort</label>
          <select className="filter-dropdown">
            <option>Default</option>
            <option>Recently Added</option>
            <option>Recently Updated</option>
            <option>Score</option>
            <option>Name A-Z</option>
            <option>Released Date</option>
            <option>Most Watched</option>
          </select>
        </div>
      </div>

      {/* Genre */}
      <div className="filter-row">
        <label>Genre</label>
        <div className="genres">
          {genArr.map((gen) => (
            <span key={gen} className="genre-item">
              {gen}
            </span>
          ))}
        </div>
      </div>

      <button className="filter-button">Apply Filters</button>
    </div>
  );
};

export default FilterComp;
