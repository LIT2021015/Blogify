"use client";
import React, { useState, useEffect } from "react";
import styles from "./featured.module.css";
import Image from "next/image";
import Link from "next/link";

const Cou = ({ posts }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % posts.length); 
    }, 4000); 

    return () => clearInterval(interval); 
  }, [posts.length]);

  return (
    <div className={styles.post}>
      <div className={styles.imgContainer}>
        <Image
          src={posts[index]?.img ? posts[index]?.img : "/p1.jpeg"}
          alt="Post Image"
          fill
          className={styles.image}
        />
      </div>
      <div className={styles.textContainer}>
        <h1 className={styles.postTitle}>{posts[index]?.title}</h1>
        <div
          className={styles.postDesc}
          dangerouslySetInnerHTML={{
            __html:
              posts[index]?.desc
                .substring(0, Math.min(posts[index]?.desc.length, 300))
                .split(" ") 
                .slice(0, -1) 
                .join(" ") + (posts[index]?.desc.length > 300 ? "..." : ""),
          }}
        />

        <Link href={`/posts/${posts[index]?.slug}`} className={styles.link}>
          Read More
        </Link>
      </div>
    </div>
  );
};

export default Cou;
