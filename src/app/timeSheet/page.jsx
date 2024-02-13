"use client";

import React, { useCallback, useEffect, useState } from "react";
import TimeSheetForm from "@/components/TimeSheetForm";
import TimeSheetsList from "@/components/TimeSheetsList";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "@/store/authStore";

import styles from "../page.module.css";

function TimeSheetPage() {
  const [timeSheets, setTimeSheets] = useState([]);
  const { setUserData } = useAuthStore();

  const api = process.env.NEXT_PUBLIC_API_URL;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const fetchTimeSheets = useCallback(async () => {
    const response = await fetch(`${api}/time-sheet`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    const data = await response.json();
    setTimeSheets(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  useEffect(() => {
    fetchTimeSheets();
    if (token) {
      const decoded = jwtDecode(token);
      setUserData(decoded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, setUserData]);

  const userData = useAuthStore((state) => state.userData);

  return (
    <main className={styles.mainPage}>
      <TimeSheetForm
        userData={userData}
        token={token}
        fetchTimeSheets={fetchTimeSheets}
      />
      <TimeSheetsList
        userData={userData}
        timeSheets={timeSheets}
        token={token}
        fetchTimeSheets={fetchTimeSheets}
      />
    </main>
  );
}

export default TimeSheetPage;
