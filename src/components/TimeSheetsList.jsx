import React from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

import styles from "../app/page.module.css";

function TimeSheetsList({ userData, timeSheets, token, fetchTimeSheets }) {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const { logout } = useAuthStore();
  const router = useRouter();

  const logOut = () => {
    router.push("/");
    logout();
  };

  const updateTimeSheet = async (timeSheetId, newStatus) => {
    try {
      const response = await fetch(`${api}/time-sheet/${timeSheetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }), // Solo actualizamos el estado
      });
      if (!response.ok) {
        throw new Error("Error al actualizar la hoja de tiempo");
      }
      const updatedTimeSheet = await response.json();
      console.log("Hoja de tiempo actualizada:", updatedTimeSheet);
      await fetchTimeSheets();
    } catch (error) {
      console.error("Error al crear la hoja de tiempo:", error.message);
    }
  };

  return (
    <main className={styles.mainTimeSheet}>
      <div className={styles.description}>
        <p>
          User:&nbsp;
          <code className={styles.code}>{userData?.email}</code>
          <span> / </span>
          Rol:&nbsp;
          <code className={styles.code}>
            {userData?.is_admin ? "Admin" : "Client"}
          </code>
        </p>
        <div>
          <button className={styles.btn} onClick={logOut}>
            Log out
          </button>
        </div>
      </div>
      <section className={styles.sectionTimeSheet}>
        <p className={styles.headerTimeSheet}>Employee</p>
        <p className={styles.headerTimeSheet}>Hourly Rate</p>
        <p className={styles.headerTimeSheet}>Hours</p>
        <p className={styles.headerTimeSheet}>Total Pay</p>
        <p className={styles.headerTimeSheet}>Status</p>
      </section>
      {timeSheets.length > 0 &&
        timeSheets.map((timeSheet, index) => (
          <section className={styles.sectionTimeSheet} key={index}>
            <p className={styles.textHeaderTimeSheet}>
              {timeSheet.employeeName}
            </p>
            <p className={styles.textHeaderTimeSheet}>
              ${timeSheet.hourlyRate}
            </p>
            <p className={styles.textHeaderTimeSheet}>{timeSheet.hours}</p>
            <p className={styles.textHeaderTimeSheet}>{timeSheet.totalPay}</p>
            {userData?.is_admin ? (
              <div className={styles.textHeaderTimeSheet}>
                <select
                  className={`${styles.statusSelect} ${
                    styles[timeSheet.status]
                  }`}
                  value={timeSheet.status}
                  onChange={(event) =>
                    updateTimeSheet(timeSheet.id, event.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Aprobada">Aprobada</option>
                  <option value="Rechazada">Rechazada</option>
                </select>
              </div>
            ) : (
              <p className={styles.textHeaderTimeSheet}>{timeSheet.status}</p>
            )}
          </section>
        ))}
    </main>
  );
}

export default TimeSheetsList;
