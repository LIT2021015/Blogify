"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js"; 
import styles from "./votes.module.css";

const Votes = ({ postId, initialUpvotes, initialDownvotes }) => {
  const { data: session } = useSession();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [hasVoted, setHasVoted] = useState(null);

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        const response = await fetch(`https://blogify-nine-phi.vercel.app
/api/votes/${postId}?userId=${session?.user?.email}`);
        const data = await response.json();

        if (response.ok) {
          setUpvotes(data.upvotes || 0);
          setDownvotes(data.downvotes || 0);
          setHasVoted(data.userVote);
        }
      } catch (error) {
        console.error("Failed to fetch vote data:", error);
      }
    };

    if (session) {
      fetchVoteData();
    }

    
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: `https://blogify-nine-phi.vercel.app
/api/pusher-auth`,
    });

    const channel = pusher.subscribe(`post-${postId}`);
    channel.bind("voteUpdated", (data) => {
      if (data.type === "upvote") {
        setUpvotes(data.upvotes);
      } else if (data.type === "downvote") {
        setDownvotes(data.downvotes);
      }
    });

    return () => {
      pusher.unsubscribe(`post-${postId}`);
    };
  }, [session, postId]);

  const handleVote = async (type) => {
    if (!session) {
      alert("You must be logged in to vote.");
      return;
    }

    const userId = session?.user?.email;
    const endpoint = type === "upvote" ? `https://blogify-nine-phi.vercel.app
/api/upvote` : `https://blogify-nine-phi.vercel.app
/api/downvote`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId }),
      });

      if (response.ok) {
        if (type === "upvote") {
          setUpvotes((prev) => prev + 1); 
          if (hasVoted === "downvote") setDownvotes((prev) => prev - 1); 
          setHasVoted("upvote");
        } else {
          setDownvotes((prev) => prev + 1); 
        if (hasVoted === "upvote") setUpvotes((prev) => prev - 1); 
        setHasVoted("downvote");

        }
      }
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  return (
    <div className={styles.votes}>
      <button
        className={`${styles.voteButton} ${hasVoted === "upvote" ? styles.active : ""}`}
        onClick={() => handleVote("upvote")}
      >
        👍 {upvotes}
      </button>
      <button
        className={`${styles.voteButton} ${hasVoted === "downvote" ? styles.active : ""}`}
        onClick={() => handleVote("downvote")}
      >
        👎 {downvotes}
      </button>
    </div>
  );
};

export default Votes;
