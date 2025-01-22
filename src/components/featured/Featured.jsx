import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";
import Link from "next/link";
import Cou from "./Cou";
const getData = async (page, cat) => {
  const res = await fetch(`https://blogify-nine-phi.vercel.app/api/postsview`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const Featured = async ({ page, cat }) => {
  const { posts, count } = await getData(page, cat);

  

  return (
    <div className={styles.container}>

      <Cou posts={posts} />
    </div>
  );
};

export default Featured;
