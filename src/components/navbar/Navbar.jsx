"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";
import Search from "../search/Search"; 
import Pusher from "pusher-js";
import styles from "./navbar.module.css";

const Navbar = ({ userId }) => {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationListVisible, setNotificationListVisible] =
    useState(false);
  const notificationListRef = useRef(null); 
  const bellRef = useRef(null); 

  const isActive = (path) => pathname === path;

  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`https://blogify-nine-phi.vercel.app
/api/notifications/get?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          console.error("Error fetching notifications:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });

    const channel = pusher.subscribe(`notifications-${userId}`);
    console.log(`Subscribed to channel: notifications-${userId}`);

    channel.bind("new-notification", (data) => {
      console.log("Notification received:", data);
      if (data?.message) {
        setNotifications((prev) => [...prev, data]);
      }
    });

    return () => {
      channel.unbind_all(); 
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [userId]);
  // Mark a notification as read and remove it from the list
  const markAsRead = async (notificationId, index) => {
    try {
      // Mark as read in the backend using fetch API
      const response = await fetch(`https://blogify-nine-phi.vercel.app
/api/notifications/markAsRead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((_, i) => i !== index));
      } else {
        console.error(
          "Error marking notification as read:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationListRef.current &&
        !notificationListRef.current.contains(event.target) &&
        !bellRef.current.contains(event.target)
      ) {
        setNotificationListVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.container}>
      <div className={styles.logo}>
        <Link href="/">Blogify</Link>
      </div>

      <div className={styles.navLinks}>
        <Link
          href="/"
          className={isActive("/") ? styles.activeLink : styles.link}
        >
          Home
        </Link>
        <Link
          href={userId ? `/feed?email=${userId}` : "/feed"} 
          className={isActive("/feed") ? styles.activeLink : styles.link}
        >
          Feeds
        </Link>
        <Link
          href="/topUsers"
          className={isActive("/topUsers") ? styles.activeLink : styles.link}
        >
          Top Bloggers
        </Link>
        <Link
          href="/about"
          className={isActive("/about") ? styles.activeLink : styles.link}
        >
          About
        </Link>
        <Link
          href="/contact"
          className={isActive("/contact") ? styles.activeLink : styles.link}
        >
          Contact
        </Link>
      </div>

      <div className={styles.rightSection}>
        <Search />
        <ThemeToggle />
        <AuthLinks />
        <div
          ref={bellRef}
          className={styles.notificationBell}
          onClick={() => setNotificationListVisible(!isNotificationListVisible)}
        >
          <div className={styles.bellIcon}>
            <span role="img" aria-label="bell">
              🔔
            </span>
            {notifications.length > 0 && (
              <span className={styles.notificationCount}>
                {notifications.length}
              </span>
            )}
          </div>
          {isNotificationListVisible && notifications.length > 0 && (
            <div ref={notificationListRef} className={styles.notificationList}>
              {notifications.map((notification, index) => (
                <div key={index} className={styles.notificationItem}>
                  <span>{notification.message}</span>
                  <button
                    className={styles.markAsReadButton}
                    onClick={() => markAsRead(notification.id, index)}
                  >
                    Mark as Read
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
