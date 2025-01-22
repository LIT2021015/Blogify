"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/compat/router";
import { useSearchParams } from "next/navigation";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    setIsClient(true);

    if (!email) return;

    const fetchUserData = async () => {
      const userRes = await fetch(`https://blogify-nine-phi.vercel.app
/api/user/${email}`);
      const userData = await userRes.json();
      setUser(userData);
    };

    const fetchUserStats = async () => {
      const statsRes = await fetch(`https://blogify-nine-phi.vercel.app
/api/stats/${email}`);
      const statsData = await statsRes.json();
      setStats(statsData);
    };

    const fetchUserBlogs = async () => {
      const blogsRes = await fetch(`https://blogify-nine-phi.vercel.app
/api/user/${email}/blog`);
      const blogsData = await blogsRes.json();
      setBlogs(blogsData);
    };

    const fetchFollowingStatus = async () => {
      if (session?.user?.email) {
        const followRes = await fetch(`https://blogify-nine-phi.vercel.app
/api/follow/status`, {
          method: "POST",
          body: JSON.stringify({
            followerEmail: session.user.email,
            followingEmail: email,
          }),
        });
        const followData = await followRes.json();
        setIsFollowing(followData.isFollowing);
      }
    };

    const fetchFollowersCount = async () => {
      const followersRes = await fetch(`https://blogify-nine-phi.vercel.app
/api/follow/count/${email}`);
      const followersData = await followersRes.json();
      setFollowersCount(followersData.count);
    };

    const fetchFollowingCount = async () => {
      const followingRes = await fetch(`https://blogify-nine-phi.vercel.app
/api/follow/following-count/${email}`);
      const followingData = await followingRes.json();
      setFollowingCount(followingData.count);
    };

    if (isClient && email) {
      fetchUserData();
      fetchUserStats();
      fetchUserBlogs();
      fetchFollowingStatus();
      fetchFollowersCount();
      fetchFollowingCount();
    }
  }, [email, isClient, session?.user?.email]);

  const handleFollowUnfollow = async () => {
    // console.log("success")
    if (session?.user?.email) {
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(`https://blogify-nine-phi.vercel.app
/api/follow`, {
        method,
        body: JSON.stringify({
          followerEmail: session.user.email,
          followingEmail: email,
        }),
      });

      console.log("success")

      if (res.ok) {
        setIsFollowing(!isFollowing); 
        if (isFollowing) {
          setFollowersCount(followersCount - 1); 
        } else {
          setFollowersCount(followersCount + 1); 
        }
      }
    }
  };

  if (!user || !stats) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <Image
          src={user.image || "/default-avatar.png"}
          alt={`${user.name}'s Avatar`}
          width={100}
          height={100}
          className={styles.avatar}
        />
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <h2>{stats.totalViews}</h2>
          <p>Total Views</p>
        </div>
        <div className={styles.statItem}>
          <h2>{stats.totalUpvotes}</h2>
          <p>Total Upvotes</p>
        </div>
        <div className={styles.statItem}>
          <h2>{stats.totalDownvotes}</h2>
          <p>Total Downvotes</p>
        </div>
        <div className={styles.statItem}>
          <h2>{followersCount}</h2>
          <p>Followers</p>
        </div>
        <div className={styles.statItem}>
          <h2>{followingCount}</h2>
          <p>Following</p>
        </div>

        {session?.user?.email !== email && (
          <button
            onClick={handleFollowUnfollow}
            className={styles.followButton}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <div className={styles.blogs}>
        <h2>Blogs:</h2>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className={styles.blogItem}>
              <div className={styles.blogImage}>
                <Image
                  src={blog.img || "/default-blog-image.jpg"}
                  alt={blog.title}
                  width={100}
                  height={100}
                  className={styles.blogImg}
                />
              </div>
              <div className={styles.blogContent}>
                <h3>{blog.title}</h3>
                <p>
                  {blog.desc.length > 100
                    ? `${blog.desc.substring(0, 100)}...`
                    : blog.desc}
                </p>
                <p className={styles.meta}>
                  Views: {blog.views} | Posted on:{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
