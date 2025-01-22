"use client";

import { signIn, useSession } from "next-auth/react";
import styles from "./loginPage.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const LoginPage = () => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); 
    }
  }, [status, router]);

  const handleSignIn = async (provider) => {
    setIsSigningIn(true); 
    try {
      await signIn(provider, {
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      setIsSigningIn(false); 
      console.error("Sign-in error:", error);
      alert("An error occurred during sign-in. Please try again.");
    }
  };

  if (status === "loading" || isSigningIn) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Logging you in...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.heading}>Welcome Back!</h2>
        <div
          className={styles.socialButton}
          onClick={() => handleSignIn("google")}
        >
          Sign in with Google
        </div>
        <div
          className={styles.socialButton}
          onClick={() => handleSignIn("github")}
        >
          Sign in with Github
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
