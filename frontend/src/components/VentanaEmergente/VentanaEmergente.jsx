import React from "react";
import PropTypes from "prop-types";

import styles from "./VentanaEmergente.module.css";

const VentanaEmergente = ({ titulo, texto, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        padding: "20px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        zIndex: 1000,
        maxWidth: "500px",
        width: "90%",
        borderRadius: "8px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h5 style={{ margin: 0 }}>{titulo}</h5>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "transparent",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
      </div>
      <hr />
      <p style={{ marginTop: "10px" }}>{texto}</p>
      <p className={styles.fechaEstilo}>2024-10-11</p>
      <div style={{ textAlign: "right" }}>
        <button className="btn btn-secondary" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

// PropTypes para validación de las propiedades
VentanaEmergente.propTypes = {
  titulo: PropTypes.string.isRequired,
  texto: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VentanaEmergente;
