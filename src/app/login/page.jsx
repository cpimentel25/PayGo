"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

import styles from "../page.module.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const api = process.env.API_URL;
  const router = useRouter();

  const { login } = useAuthStore();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch(`${api}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      const token = data.access_token;

      // Actualizar el estado de autenticación
      login(token);

      router.push("/timeSheet");

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error al registrar: ${errorData.message}`);
        return;
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.centerItems}>
        <form className={styles.centerItems} onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={styles.inputForm}
          />
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={styles.inputForm}
          />
          <button className={styles.button} type="submit">
            <p className={styles.textBtn}>Login</p>
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
