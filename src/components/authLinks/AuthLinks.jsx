"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import styles from "./authLinks.module.css";

const AuthLinks = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [burgerOpen, setBurgerOpen] = useState(false);
  const { status, data: session } = useSession();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {status === "unauthenticated" ? (
        <Link href="/login" className={styles.link}>
          Login
        </Link>
      ) : (
        <div className={styles.authContainer}>
          <div className={styles.avatarContainer} ref={dropdownRef}>
            <Image
              src={session?.user?.image || "/default-avatar.png"}
              alt="User Avatar"
              width={40}
              height={40}
              className={styles.avatar}
              onClick={toggleDropdown}
            />
            {menuOpen && (
              <div className={styles.dropdownMenu}>
                <Link
                  href={`/profile?email=${encodeURIComponent(
                    session.user.email
                  )}`}
                  className={styles.dropdownItem}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href={`/feed?email=${encodeURIComponent(session.user.email)}`}
                  className={styles.dropdownItem}
                  onClick={() => setMenuOpen(false)}
                >
                  My Feed
                </Link>
                <Link href="/write" className={styles.dropdownItem}>
                  Write
                </Link>
                <span
                  className={styles.dropdownItem}
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className={styles.burger} onClick={() => setBurgerOpen(!burgerOpen)}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
      {burgerOpen && (
        <div className={styles.responsiveMenu}>
          <Link href="/" onClick={() => setBurgerOpen(false)}>
            Homepage
          </Link>
          <Link href="/about" onClick={() => setBurgerOpen(false)}>
            About
          </Link>
          <Link href="/contact" onClick={() => setBurgerOpen(false)}>
            Contact
          </Link>
          {status === "unauthenticated" ? (
            <Link href="/login" onClick={() => setBurgerOpen(false)}>
              Login
            </Link>
          ) : (
            <>
              <Link href="/write" onClick={() => setBurgerOpen(false)}>
                Write
              </Link>
              <span
                onClick={() => {
                  signOut();
                  setBurgerOpen(false);
                }}
              >
                Logout
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;
