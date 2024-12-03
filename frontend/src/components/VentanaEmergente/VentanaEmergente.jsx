import React from "react";
import PropTypes from "prop-types";

import styles from "./VentanaEmergente.module.css";

const VentanaEmergente = ({ titulo, texto, fecha, onClose }) => {
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
      {/* <p style={{ marginTop: "10px" }}>{texto}</p> */}
      <p 
        className="mt-3" 
        dangerouslySetInnerHTML={{ __html: texto }}
      />
      <p className={styles.fechaEstilo}>{fecha}</p>
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
