"use client";
import React, { useState, useEffect } from "react";
import "./NavCss/searchInput.css";
import { FaAngleRight, FaFilter, FaSearch } from "react-icons/fa";

const SearchInput = (props) => {
  const [value, setValue] = useState("");
  const [data, setData] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value.length > 0) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/search?keyword=${value}`);
          const result = await response.json();

          if (response.ok) {
            setData(result); // Set the response data from MongoDB
          } else {
            setData(null);
            console.error(result.message);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    } else {
      setData(null);
    }
  }, [value]);

  return (
    <>
      {props.float ? (
        <div className="search-container">
          <div className="common-wealth">
            <div className="filter-ico"><FaFilter /></div>
            <div className="float-bloc">
              <div className="Input-text">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Slight delay for clicking dropdown
                  placeholder="Search anime..."
                />
              </div>
              <div className="flit">
                <div>
                  <FaSearch />
                </div>
                {!props.float && <div className="filter-btn">Filter</div>}
              </div>
            </div>
          </div>
          {isFocused && data && (
            <div className="dropdown">
              {data.map((item) => (
                <div key={item.id} className="dropdown-item">
                  <img
                    src={item.imgData}
                    alt={item.title}
                    className="dropdown-img"
                  />
                  <div className="dropdown-info">
                    <h4 className="titlel">
                      {item.title.length > 35
                        ? item.title.slice(0, 35) + "..."
                        : item.title}
                    </h4>
                    <p>
                      {item.japanese_title.length > 40
                        ? item.japanese_title.slice(0, 40) + "..."
                        : item.japanese_title}
                    </p>
                    <div className="tag-all">
                      <div>{item.releaseDate}</div>
                      <div className="dotol">&#x2022;</div>
                      <div className="showt">{item.showType}</div>
                      <div className="dotol">&#x2022;</div>
                      <div>{item.duration}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="allR">
                {" "}
                <div>View all results</div>
                <div>
                  <FaAngleRight />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="search-container">
          <div className="Input-bloc">
            <div className="Input-text">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Slight delay for clicking dropdown
                placeholder="Search anime..."
              />
            </div>
            <div className="flit">
              <div>
                <FaSearch />
              </div>
              {!props.float && <div className="filter-btn">Filter</div>}
            </div>
          </div>
          {isFocused && data && (
            <div className="dropdown">
              {data.map((item) => (
                <div key={item.id} className="dropdown-item">
                  <img
                    src={item.imgData}
                    alt={item.title}
                    className="dropdown-img"
                  />
                  <div className="dropdown-info">
                    <h4 className="titlel">
                      {item.title.length > 35
                        ? item.title.slice(0, 35) + "..."
                        : item.title}
                    </h4>
                    <p>
                      {item.japanese_title.length > 40
                        ? item.japanese_title.slice(0, 40) + "..."
                        : item.japanese_title}
                    </p>
                    <div className="tag-all">
                      <div>{item.releaseDate}</div>
                      <div className="dotol">&#x2022;</div>
                      <div className="showt">{item.showType}</div>
                      <div className="dotol">&#x2022;</div>
                      <div>{item.duration}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="allR">
                {" "}
                <div>View all results</div>
                <div>
                  <FaAngleRight />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchInput;
