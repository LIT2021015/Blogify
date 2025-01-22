import React from "react";
import styles from "./footer.module.css";
import Link from "next/link";

const Footer = () => {
  return (
    <div className={styles.container1}>
      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.logo}>
            <h1 className={styles.logoText}>BLOGIFY</h1>
          </div>
          <p className={styles.desc}>
            Discover a world of insights, stories, and perspectives at Blogify.
            Explore the latest trends, dive into thought-provoking articles, and
            join a community passionate about sharing knowledge and experiences.
          </p>
        </div>

        <div className={styles.links}>
          <div className={styles.list}>
            <span className={styles.listTitle}>Links</span>
            <Link href="/">Homepage</Link>
            <Link href="/">Blog</Link>
            <Link href="/">About</Link>
            <Link href="/">Contact</Link>
          </div>
          <div className={styles.list}>
            <span className={styles.listTitle}>Tags</span>
            <Link href="/blog?cat=style">Style</Link>
            <Link href="/blog?cat=fashion">Fashion</Link>
            <Link href="/blog?cat=coding">Coding</Link>
            <Link href="/blog?cat=travel">Travel</Link>
          </div>
          <div className={styles.list}>
            <span className={styles.listTitle}>Social</span>
            <Link href="/">Facebook</Link>
            <Link href="/">Instagram</Link>
            <Link href="/">LinkedIn</Link>
            <Link href="/">YouTube</Link>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} Blogify. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
