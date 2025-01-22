"use client";

import styles from "./aboutPage.module.css";

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>About Blogify</h1>
        <p className={styles.description}>
          Blogify is a blogging cum social media platform where individuals can share their thoughts, ideas, and experiences with the world. It&apos;s a place to learn, grow, and connect with people who share similar passions and interests.
        </p>
        <p className={styles.details}>
          Whether you&apos;re a budding writer, an experienced content creator, or someone who enjoys reading others&apos; perspectives, Blogify provides an open space to explore and share.
        </p>
        <div className={styles.founderSection}>
          <h2 className={styles.founderTitle}>Founded by Ayush Kamal</h2>
          <p className={styles.founderDescription}>
            Blogify was founded by Ayush Kamal with the vision to create a platform where people can exchange ideas and grow together. As a passionate advocate for knowledge sharing and community building, Ayush has worked hard to make Blogify a space where everyone can be heard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
