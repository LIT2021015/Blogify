"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const AuthLinks = () => {
  const [open, setOpen] = useState(false);

  const { status , data} = useSession();
  return (
    <>
      {status === "unauthenticated" ? (
        <Link href="/login" className={styles.link}>
          Login
        </Link>
      ) : (
        <>
          <Link href="/write" className={styles.link}>
            Write
          </Link>
          <span className={styles.link} onClick={signOut}>
            Logout
          </span>
        </>
      )}
      <div className={styles.burger} onClick={() => setOpen(!open)}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
      {open && (
        <div className={styles.responsiveMenu}>
          <Link href="/" onClick={() => setOpen(!open)}>Homepage</Link>
          <Link href="/" onClick={() => setOpen(!open)}>About</Link>
          <Link href="/" onClick={() => setOpen(!open)}>Contact</Link>
          {status === "unauthenticated" ? (
            <Link href="/login" onClick={() => setOpen(!open)}>Login</Link>
          ) : (
            <>
              <Link href="/write" onClick={() => setOpen(!open)}>Write</Link>
              <span onClick={() => setOpen(!open)}>Logout</span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;
