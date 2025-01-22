"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./feed.module.css";

const Feed = () => {
  const [feedPosts, setFeedPosts] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    const fetchFeed = async () => {
      const res = await fetch(email ? `https://blogify-nine-phi.vercel.app
/api/feed/${email}` : `https://blogify-nine-phi.vercel.app
/api/feed`);
      const data = await res.json();
      setFeedPosts(data);
    };

    const fetchTopUsers = async () => {
      const response = await fetch("/api/topUsers");
      const data = await response.json();
      setTopUsers(data);
    };

    fetchFeed();
    fetchTopUsers();
  }, [email]);

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return `${words.slice(0, wordLimit).join(" ")}...`;
    }
    return text;
  };

  return (
    <div className={styles.Container}>
      {/* Feed Content */}
      <div className={styles.feedContent}>
        <div className={styles.feedContainer}>
          {feedPosts.map((post) => {
            const upvotes =
              post.votes?.filter((vote) => vote.type === "upvote").length || 0;
            const downvotes =
              post.votes?.filter((vote) => vote.type === "downvote").length || 0;

            return (
              <div key={post.id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <Image
                    src={post?.user?.image || "/default-avatar.png"}
                    alt={`${post.user.name}'s profile`}
                    className={styles.profileImage}
                    width={50}
                    height={50}
                    priority
                  />
                  <div>
                    <p className={styles.userName}>{post.user.name}</p>
                    <p className={styles.postDate}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {post.img && (
                  <div className={styles.postImageContainer}>
                    <Image
                      src={post.img}
                      alt={post.title}
                      className={styles.postImage}
                      width={600}
                      height={400}
                      layout="responsive"
                      objectFit="cover"
                    />
                  </div>
                )}

                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postCategory}>
                  <strong>Category:</strong> {post.catSlug}
                </p>
                <p
                  className={styles.postDescription}
                  dangerouslySetInnerHTML={{
                    __html: truncateText(post.desc.replace(/<[^>]+>/g, ""), 20),
                  }}
                ></p>

                <div className={styles.postStats}>
                  <p>
                    <strong>Views:</strong> {post.views}
                  </p>
                  <p>
                    <strong>Upvotes:</strong> {upvotes}
                  </p>
                  <p>
                    <strong>Downvotes:</strong> {downvotes}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Users Side Show */}
      <div className={styles.sideShow}>
        <h2>Top Users</h2>
        {topUsers.map((user) => (
          <div key={user.id} className={styles.userCard}>
            <Image
              src={user.image || "/default-avatar.png"}
              alt={`${user.name}'s profile`}
              className={styles.userImage}
              width={40}
              height={40}
            />
            <div>
              <p className={styles.userName}>{user.name}</p>
              <p className={styles.userStats}>
                <strong>Posts:</strong> {user.totalPosts}
              </p>
              <p className={styles.userStats}>
                <strong>Upvotes:</strong> {user.totalUpvotes}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
