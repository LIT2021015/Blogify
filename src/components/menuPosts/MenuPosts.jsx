import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./menuPosts.module.css"

const getData = async () => {
  const res = await fetch(`https://blogify-nine-phi.vercel.app/api/postsview?cat=travel`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const getData1 = async () => {
  const res = await fetch(`https://blogify-nine-phi.vercel.app/api/postsview?cat=culture`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};
const getData2 = async () => {
  const res = await fetch(`https://blogify-nine-phi.vercel.app/api/postsview?cat=food`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};
const getData3 = async () => {
  const res = await fetch(`https://blogify-nine-phi.vercel.app/api/postsview?cat=fashion`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};



const MenuPosts = async({ withImage }) => {

  const { posts, count } = await getData();
  const { posts:posts1 ,count:count1} = await getData1();
  const { posts:posts2 ,count:count2} = await getData2();
  const { posts:posts3,count:count3} = await getData3();
  return (
    <div className={styles.items}>
     {count &&<Link href="/" className={styles.item}>
        {withImage && (
          <div className={styles.imageContainer}>
            <Image src={posts[0]?.img ? posts[0]?.img : "/p1.jpeg"} alt="" fill className={styles.image} />
          </div>
        )}
        <div className={styles.textContainer}>
          <span className={`${styles.category} ${styles.travel}`}>Travel</span>
          <h3 className={styles.postTitle}>
          <div
            className={styles.postDesc}
            dangerouslySetInnerHTML={{
              __html: posts[0]?.desc.substring(0, 60),
            }}
          />
          </h3>
          <div className={styles.detail}>
            <span className={styles.username}>{posts[0]?.user}</span>
            <span className={styles.date}> - {posts[0]?.createdAt.substring(0, 10)}</span>
          </div>
        </div>
      </Link>}
      { count1 &&
      <Link href="/" className={styles.item}>
        {withImage && (
          <div className={styles.imageContainer}>
            <Image src={posts1[0]?.img ? posts1[0]?.img : "/p1.jpeg"} alt="" fill className={styles.image} />
          </div>
        )}
        <div className={styles.textContainer}>
          <span className={`${styles.category} ${styles.culture}`}>
            Culture
          </span>
          <h3 className={styles.postTitle}>
          <div
            className={styles.postDesc}
            dangerouslySetInnerHTML={{
              __html: posts1[0]?.desc.substring(0, 60),
            }}
          />
          </h3>
          <div className={styles.detail}>
            <span className={styles.username}>{posts1[0]?.user}</span>
            <span className={styles.date}>- {posts1[0]?.createdAt.substring(0, 10)}</span>
          </div>
        </div>
      </Link>}
     {count2 && <Link href="/" className={styles.item}>
        {withImage && (
          <div className={styles.imageContainer}>
            <Image src={posts2[0]?.img ? posts2[0]?.img : "/p1.jpeg"} alt="" fill className={styles.image} />
          </div>
        )}
        <div className={styles.textContainer}>
          <span className={`${styles.category} ${styles.food}`}>Food</span>
          <h3 className={styles.postTitle}>
          <div
            className={styles.postDesc}
            dangerouslySetInnerHTML={{
              __html: posts2[0]?.desc.substring(0, 60),
            }}
          />
          </h3>
          <div className={styles.detail}>
            <span className={styles.username}>{posts2[0]?.user}</span>
            <span className={styles.date}> - {posts2[0]?.createdAt.substring(0, 10)}</span>
          </div>
        </div>
      </Link>
      }
     { count3 &&<><Link href="/" className={styles.item}>
        {withImage && (
          <div className={styles.imageContainer}>
            <Image src={posts3[0]?.img ? posts3[0]?.img : "/p1.jpeg"} alt="" fill className={styles.image} />
          </div>
        )}
        <div className={styles.textContainer}>
          <span className={`${styles.category} ${styles.fashion}`}>
            Fashion
          </span>
          <h3 className={styles.postTitle}>
               <div
            className={styles.postDesc}
            dangerouslySetInnerHTML={{
              __html: posts3[0]?.desc.substring(0, 60),
            }}
          />
          </h3>
          <div className={styles.detail}>
            <span className={styles.username}>{posts3[0]?.user}</span>
            <span className={styles.date}> - {posts3[0]?.createdAt.substring(0, 10)}</span>
          </div>
        </div>
      </Link></>}
    </div>
  );
};

export default MenuPosts;
