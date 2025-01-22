"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import styles from "./TopUsers.module.css";

export default function TopUsers() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followStatus, setFollowStatus] = useState({});
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchTopUsers() {
      try {
        const response = await fetch(`https://blogify-nine-phi.vercel.app
/api/topUsers`);
        const data = await response.json();
        setTopUsers(data);
        setLoading(false);

        const initialFollowStatus = {};

        for (const user of data) {
          const followRes = await fetch(`https://blogify-nine-phi.vercel.app
/api/follow/status`, {
            method: "POST",
            body: JSON.stringify({
              followerEmail: session?.user?.email,
              followingEmail: user.email, 
            }),
          });
          const followData = await followRes.json();
          initialFollowStatus[user.email] = followData.isFollowing; 
        }

        setFollowStatus(initialFollowStatus);
      } catch (error) {
        console.error("Failed to fetch top users:", error);
        setLoading(false);
      }
    }

    // if (session?.user?.email) {
      fetchTopUsers();
    
  }, [session]);

  const handleFollowUnfollow = async (userEmail) => {

    if (!session?.user?.email) {
      alert("Please log in to follow or unfollow users.");
      return;
    }

    if (session?.user?.email) {
      const isFollowing = followStatus[userEmail];
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(`https://blogify-nine-phi.vercel.app
/api/follow`, {
        method,
        body: JSON.stringify({
          followerEmail: session.user.email,
          followingEmail: userEmail,
        }),
      });

      if (res.ok) {
        setFollowStatus((prevState) => ({
          ...prevState,
          [userEmail]: !isFollowing,
        }));
      }
    }
  };

  if (loading) {
    return <div className={styles.loader}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Top Users</h1>
      <ul className={styles.userList}>
        {topUsers.map((user, index) => (
          <li key={user.email} className={styles.userCard}>
            <div className={styles.rank}>#{index + 1}</div>
            <Image
              src={user.image || "/default-avatar.png"}
              alt={user.name || "User Avatar"}
              width={50}
              height={50}
              className={styles.avatar}
            />
            <div className={styles.info}>
              <h2>{user.name || "Anonymous"}</h2>
              <p>Email: {user.email}</p>
              <p>Total Upvotes: {user.totalUpvotes}</p>
              <p>Total Views: {user.totalViews}</p>
              <p>Total Posts: {user.totalPosts}</p>
              <p>Score: {user.score}</p>
            </div>
            {session?.user?.email !== user.email && (
              <button
                className={`${styles.followButton} ${
                  followStatus[user.email] ? styles.following : ""
                }`}
                onClick={() => handleFollowUnfollow(user.email)}
              >
                {followStatus[user.email] ? "Unfollow" : "Follow"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
