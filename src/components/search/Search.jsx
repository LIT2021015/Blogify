"use client";
import React, { useState } from "react";
import styles from "./search.module.css";
import { useRouter } from "next/navigation";
const Search = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    console.log(inputValue);

    router.push(`/search?q=${inputValue}`);
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.container1}
        placeholder="Search on Blogify"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button className={styles.container2} onClick={handleSubmit}>
        SEARCH
      </button>
    </div>
  );
};

export default Search;
