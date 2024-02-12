import React, { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

import styles from "../app/page.module.css";

function TimeSheetsList({ userData }) {
  const [timeSheets, setTimeSheets] = useState([]);
  const { logout } = useAuthStore();

  const api = process.env.API_URL;
  const router = useRouter();

  useEffect(() => {
    // Solicitud al backend para obtener las hojas de tiempo
    const fetchTimeSheets = async () => {
      const response = await fetch(`${api}/time-sheet`, {
        method: "GET",
      });
      const data = await response.json();
      console.log("🚀 ~ fetchTimeSheets ~ data:", data);
      setTimeSheets(data);
    };
    fetchTimeSheets();
  }, [api]);

  const logOut = () => {
    logout();
    router.push("/");
  };

  return (
    <main className={styles.mainTimeSheet}>
      <div className={styles.description}>
        <p>
          User:&nbsp;
          <code className={styles.code}>{userData.email}</code>
          <span> / </span>
          Rol:&nbsp;
          <code className={styles.code}>
            {userData.is_admin ? "Admin" : "Client"}
          </code>
        </p>
        <button className={styles.btn} onClick={logOut}>
          Log out
        </button>
      </div>
      {timeSheets.length > 0 ? (
        timeSheets.map((timeSheet, index) => (
          <section className={styles.centerItems} key={index}>
            <section className={styles.sectionTimeSheet}>
              <div className={styles.headerSection}>
                <p className={styles.headerTimeSheet}>Employee</p>
                <p className={styles.textHeaderTimeSheet}>
                  {timeSheet.employeeName}
                </p>
              </div>
              <div className={styles.headerSection}>
                <p className={styles.headerTimeSheet}>Hours</p>
                <p className={styles.textHeaderTimeSheet}>{timeSheet.hours}</p>
              </div>
              <div className={styles.headerSection}>
                <p className={styles.headerTimeSheet}>Hourly Rate</p>
                <p className={styles.textHeaderTimeSheet}>
                  {timeSheet.hourlyRate}
                </p>
              </div>
              <div className={styles.headerSection}>
                <p className={styles.headerTimeSheet}>Total Pay</p>
                <p className={styles.textHeaderTimeSheet}>
                  {timeSheet.totalPay}
                </p>
              </div>
            </section>
          </section>
        ))
      ) : (
        <section className={styles.centerItems}>
          <section className={styles.sectionTimeSheet}>
            <div className={styles.headerSection}>
              <p className={styles.headerTimeSheet}>Employee</p>
              <p className={styles.textHeaderTimeSheet}></p>
            </div>
            <div className={styles.headerSection}>
              <p className={styles.headerTimeSheet}>Hours</p>
              <p className={styles.textHeaderTimeSheet}></p>
            </div>
            <div className={styles.headerSection}>
              <p className={styles.headerTimeSheet}>Hourly Rate</p>
              <p className={styles.textHeaderTimeSheet}></p>
            </div>
            <div className={styles.headerSection}>
              <p className={styles.headerTimeSheet}>Total Pay</p>
              <p className={styles.textHeaderTimeSheet}></p>
            </div>
          </section>
        </section>
      )}
    </main>
  );
}

export default TimeSheetsList;
