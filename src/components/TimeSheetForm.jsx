import React, { useState } from "react";

import styles from "../app/page.module.css";

const initialEntries = [
  {
    employeeName: "",
    hourlyRate: 12.0,
    hours: 1,
    totalPay: "",
    description: "PayGo",
    userId: "",
  },
];

function TimeSheetForm({ userData, token, fetchTimeSheets }) {
  const userId = userData?.sub;
  const api = process.env.NEXT_PUBLIC_API_URL;

  const [entries, setEntries] = useState(
    initialEntries.map((entry) => ({ ...entry, userId: userId }))
  );

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        employeeName: "",
        hourlyRate: 12.0,
        hours: 1,
        totalPay: 0,
        description: "PayGo",
        userId: userId,
      },
    ]);
  };

  const removeEntry = () => {
    setEntries(entries.slice(0, -1));
  };

  const updateEntry = (index, field, value) => {
    const updatedEntries = entries.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );

    if (field === "hourlyRate" || field === "hours") {
      const updatedEntry = updatedEntries[index];
      updatedEntry.totalPay = updatedEntry.hourlyRate * updatedEntry.hours;
      updatedEntries[index] = updatedEntry;
    }

    setEntries(updatedEntries);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación antes de llamar a onSubmit
    const isValid = entries.every((entry) => {
      const hourlyRateValid = parseFloat(entry.hourlyRate) >= 12;
      const hoursValid = entry.hours > 0;
      const totalPayValid = entry.hourlyRate * entry.hours >= 100;

      if (!hourlyRateValid) {
        alert("La tarifa por hora de cada entrada debe ser al menos $12.00.");
      }
      if (!hoursValid) {
        alert("No debe haber filas con 'Hours' vacías.");
      }
      if (!totalPayValid) {
        alert("El pago total de cada empleado no debe ser inferior a $100.00.");
      }

      return hourlyRateValid && hoursValid && totalPayValid;
    });

    if (!isValid) {
      return; // Detener si la validación falla
    }

    // Envio de datos
    const onSubmit = async () => {
      try {
        const response = await fetch(`${api}/time-sheet`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(entries),
        });

        if (!response.ok) {
          throw new Error("No se pudo crear la hoja de tiempo");
        }

        const data = await response.json();
        console.log("🚀 ~ Hoja de tiempo creada:", data);
        alert("🚀 ~ Hoja de tiempo creada ~ 🚀");

        await fetchTimeSheets();

        // Restablecer el estado de 'entries' a su estado inicial
        setEntries(
          initialEntries.map((entry) => ({ ...entry, userId: userId }))
        );
      } catch (error) {
        console.error("Error al crear la hoja de tiempo:", error.message);
        alert(error.message);
      }
    };

    await onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      {entries.map((entry, index) => (
        <div key={index} className={styles.formTimeSheet}>
          <div className={styles.headerSection}>
            <p className={styles.headerTimeSheet}>Employee</p>
            <input
              className={styles.inputFormTimeSheet}
              type="text"
              placeholder="Employee Name"
              value={entry.employeeName}
              onChange={(event) =>
                updateEntry(index, "employeeName", event.target.value)
              }
            />
          </div>
          <div className={styles.headerSection}>
            <p className={styles.headerTimeSheet}>Hourly Rate</p>
            <input
              className={styles.inputFormTimeSheet}
              type="text"
              placeholder="Hourly Rate"
              value={entry.hourlyRate}
              onChange={(event) => {
                // Permite la entrada de números y decimales sin formatear inmediatamente
                const value = event.target.value;
                const regex = /^[0-9]*\.?[0-9]*$/; // Expresión regular para validar el input numérico y decimal
                if (regex.test(value) || value === "") {
                  updateEntry(index, "hourlyRate", value);
                }
              }}
              onBlur={(event) => {
                // Formatea a dos decimales solo al perder el foco, si el valor es numérico
                const value = parseFloat(event.target.value);
                if (!isNaN(value)) {
                  updateEntry(index, "hourlyRate", value.toFixed(2));
                }
              }}
            />
          </div>
          <div className={styles.headerSection}>
            <p className={styles.headerTimeSheet}>Hours</p>
            <input
              className={styles.inputFormTimeSheet}
              type="number"
              placeholder="Hours"
              min="1"
              value={entry.hours}
              onChange={(event) =>
                updateEntry(index, "hours", parseFloat(event.target.value))
              }
            />
          </div>

          <div className={styles.headerSection}>
            <p className={styles.headerTimeSheet}>Total Pay</p>
            <input
              className={styles.inputFormTimeSheet}
              type="number"
              placeholder="Total Pay"
              value={entry.totalPay}
              readOnly
            />
          </div>
        </div>
      ))}
      <div>
        <button className={styles.btn} type="button" onClick={addEntry}>
          Add Entry
        </button>
        {entries.length > 1 && (
          <button className={styles.btn} type="button" onClick={removeEntry}>
            Remove Entry
          </button>
        )}
        <button className={styles.btn} type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

export default TimeSheetForm;
