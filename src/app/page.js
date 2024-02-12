"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()
  const { isLoggedIn, logout } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/timeSheet');
    }
  }, [isLoggedIn, router])


  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          PayGo:&nbsp;
          <code className={styles.code}>Test</code>
        </p>
      </div>
      {!isLoggedIn &&
        <div className={styles.centerItems}>
          <button className={styles.button} onClick={() => router.push('/login')}>
            <p className={styles.textBtn}>Login</p>
          </button>
          <button
            className={styles.button}
            onClick={() => router.push('/register')}
          >
            <p className={styles.textBtn}>Register</p>
          </button>
        </div>
      }

      <div className={styles.grid}></div>
    </main>
  );
}
