import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";
import Link from "next/link";
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
      <h1 className={styles.title}>
        <b>Hey, welcome to Blogify!</b> Discover Your stories and creative
        ideas.
      </h1>
      <div className={styles.post}>
        <div className={styles.imgContainer}>
          <Image
            src={posts[0]?.img ? posts[0]?.img : "/p1.jpeg"}
            alt=""
            fill
            className={styles.image}
          />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.postTitle}>{posts[0]?.title}</h1>
          <div
            className={styles.postDesc}
            dangerouslySetInnerHTML={{
              __html:
                posts[0]?.desc
                  .substring(0, Math.min(posts[0]?.desc.length, 300))
                  .split(" ") // split the string into words
                  .slice(0, -1) // remove the last element if it's incomplete
                  .join(" ") + (posts[0]?.desc.length > 300
                   ? "..." : ""),
            }}
          />

          <Link href={`/posts/${posts[0]?.slug}`} className={styles.link}>
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Featured;
