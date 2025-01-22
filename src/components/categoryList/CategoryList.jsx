import React from "react";
import styles from "./categoryList.module.css";
import Link from "next/link";
import Image from "next/image";

const getData = async () => {
  const res = await fetch(
    "https://blogify-nine-phi.vercel.app/api/categories",
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
  }

  const data = await res.json();

  // console.log(data)
  return data;
};

const getRandomColor = () => {
  const colors = [
    "#2A9D8F", // Teal
    "#264653", // Dark Blue
    "#6A0572", // Purple
    "#8A3FFC", // Bright Violet
    "#E63946", // Red
    "#1D3557", // Navy
    "#457B9D", // Steel Blue
    "#4A4E69", // Charcoal Purple
    "#FF6F61", // Coral Red
    "#C44536", // Brick Red
    "#2E4057", // Deep Slate Blue
    "#0A9396", // Deep Cyan
    "#9A031E", // Crimson
    "#6A994E", // Forest Green
    "#3D348B", // Deep Indigo
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
const CategoryList = async () => {
  const data = await getData();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Popular Categories</h1>
      <div className={styles.categories}>
        {data?.map((item) => (
          <Link
            href={`/blog?cat=${item.title}`}
            className={`${styles.category} ${styles[item.slug]}`}
            // style={{
            //   backgroundColor: styles[item.slug] ? undefined : getRandomColor(),
            // }}
            key={item._id}
          >
            {item.img && (
              <Image
                src={item.img}
                alt=""
                width={32}
                height={32}
                className={styles.image}
              />
            )}
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
