"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "../page.module.css";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const api = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  //Validación de email
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Validación de password
  const isValidPassword = (password) =>
    password.length >= 6 && /[A-Z]/.test(password);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValidPassword(password)) {
      alert(
        "El password debe tener minimo 6 caracteres y uno de los caracteres debe ser una letra en mayuscula"
      );
      return;
    }

    // Datos a enviar
    const userData = {
      email,
      password,
      is_admin: isAdmin,
    };

    try {
      const response = await fetch(`${api}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error al registrar: ${errorData.message}`);
        return;
      }

      alert("Usuario registrado con éxito");

      // Redirigir o limpiar el formulario aquí
      router.push("/login");
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      alert("Error al realizar la solicitud");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.centerItems}>
        <div style={{ width: "500px" }}>
          <h3>Importante:</h3>
          <p>
            El password debe tener minimo 6 caracteres y uno de los caracteres
            debe ser una letra en mayuscula.
          </p>
        </div>
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
          <div>
            <label htmlFor="isAdmin">Register as Admin:</label>
            <input
              id="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={(event) => setIsAdmin(event.target.checked)}
            />
          </div>
          <button
            className={styles.button}
            type="submit"
            // disabled={!isValidEmail(email) || !password || password.length < 6}
          >
            {" "}
            <p className={styles.textBtn}>Register</p>
          </button>
        </form>
      </div>
    </main>
  );
}

export default RegisterPage;
