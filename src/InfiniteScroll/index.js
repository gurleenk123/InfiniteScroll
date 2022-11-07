import React, { useState, useRef, useCallback } from "react";
import "./index.css";
import useBookSearch from "./useBookSearch";

export function InfiniteScroll() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  const handlechange = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  let observer = useRef();
  let lastBook = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  
  return (
    <>
      <div className="header">
        <input
          type="text"
          placeholder="Search any Book"
          value={query}
          onChange={handlechange}
        ></input>
      </div>
      <div>
        {books.map((book, index) => {
          if (books.length === index + 1) {
            return (
              <li ref={lastBook} key={book}>
                {book}
              </li>
            );
          } else {
            return <li key={book}>{book}</li>;
          }
        })}
      </div>
      <div>{loading && "Loading....."}</div>
      <div>{error && "Error"}</div>
    </>
  );
}
