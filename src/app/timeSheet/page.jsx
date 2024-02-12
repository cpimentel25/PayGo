"use client";

import React, { useEffect, useState } from "react";
import TimeSheetForm from "@/components/TimeSheetForm";
import TimeSheetsList from "@/components/TimeSheetsList";
import { jwtDecode } from "jwt-decode";

import styles from "../page.module.css";

function TimeSheetPage() {
  const [userData, setUserData] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserData(decoded);
    }
  }, [token]);

  return (
    <main className={styles.mainPage}>
      <TimeSheetForm userData={userData} token={token} />
      <TimeSheetsList userData={userData} />
    </main>
  );
}

export default TimeSheetPage;
