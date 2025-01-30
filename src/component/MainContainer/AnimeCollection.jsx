"use client";
import React from "react";
import Card from "../Card/Card";
import "./main-container.css";
import Link from "next/link";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaChevronRight,
} from "react-icons/fa";

export default function AnimeCollection(props) {
  const handleNavigation = () => {
    props.IsLoading(true);
  };

  // Render cards based on data passed as props
  const cards = props?.data?.map((data) => (
    <Card
      key={props.datr === "yes" ? data.info.results.data.id : data.id}
      datr={props?.datr ? "yes" : ""}
      data={data}
      collectionName={props.collectionName}
      IsLoading={props.IsLoading}
      selectL={props.selectL}
    />
  ));

  // Pagination logic
  let useArr = [];
  const currentPage = parseInt(props.page) || 1;
  const totalPages = parseInt(props.totalPages) || 1;

  // Calculate pagination array
  if (totalPages <= 3) {
    useArr = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (currentPage < 3) {
    useArr = [1, 2, 3];
  } else if (currentPage >= totalPages - 1) {
    useArr = [totalPages - 2, totalPages - 1, totalPages];
  } else {
    useArr = [currentPage - 1, currentPage, currentPage + 1];
  }

  return (
    <div className="anime-collection-wrapper">
      <div className="header heddR">
        <h2 className="header-title heddH2">{props.collectionName}</h2>
        {props.isInGrid ? null : (
          <Link
            href={`/grid?name=${props.filterName}&heading=${props.collectionName}`}
            className="view-more-link view-more-linkop"
            onClick={handleNavigation}
          >
            View More
            <FaChevronRight size={14} />
          </Link>
        )}
      </div>

      <div className="card-wrapper d-flex a-center j-center">{cards}</div>

      {totalPages > 1 && (
        <div className="pagination">
          {currentPage > 1 && (
            <>
              <Link
                href={`/grid?name=${props.filterName}&heading=${props.collectionName}`}
                className="pagination-tile"
                onClick={handleNavigation}
              >
                <FaAngleDoubleLeft />
              </Link>

              <Link
                href={`/grid?name=${props.filterName}&heading=${
                  props.collectionName
                }&page=${currentPage - 1}`}
                className="pagination-tile"
                onClick={handleNavigation}
              >
                <FaAngleLeft />
              </Link>
            </>
          )}

          {useArr.map((ii) => (
            <Link
              key={ii}
              href={`/grid?name=${props.filterName}&heading=${
                props.collectionName
              }${ii > 1 ? `&page=${ii}` : ""}`}
              className={`pagination-tile ${
                currentPage === ii ? "pagination-active" : ""
              }`}
              onClick={handleNavigation}
            >
              {ii}
            </Link>
          ))}

          {currentPage < totalPages && (
            <>
              <Link
                href={`/grid?name=${props.filterName}&heading=${
                  props.collectionName
                }&page=${currentPage + 1}`}
                className="pagination-tile"
                onClick={handleNavigation}
              >
                <FaAngleRight />
              </Link>

              <Link
                href={`/grid?name=${props.filterName}&heading=${props.collectionName}&page=${totalPages}`}
                className="pagination-tile"
                onClick={handleNavigation}
              >
                <FaAngleDoubleRight />
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
