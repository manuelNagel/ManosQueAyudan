import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "./Notificaciones.module.css";
import VentanaEmergente from "../VentanaEmergente/VentanaEmergente"; // Importamos el nuevo componente
import { useAuth } from "../../context/AuthContext";

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user}  = useAuth();

  // Estado para controlar la ventana emergente
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Fetch de notificaciones
  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        
        const [notificacionesRes, unreadCountRes] = await Promise.all([
          axios.get(`/api/usuarios/${user.id}/notificaciones`),
          axios.get(`/api/notificaciones/${user.id}/unread-count`),
        ]);
        setNotificaciones(notificacionesRes.data);
        setUnreadCount(unreadCountRes.data.unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotificaciones();
  }, []);

  // Marcar notificación como leída
  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notificaciones/${id}/mark-as-read`);
      setNotificaciones((prevNotificaciones) =>
        prevNotificaciones.map((noti) =>
          noti.idNotificacion === id
            ? { ...noti, fechaLeido: new Date().toISOString() }
            : noti
        )
      );
      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Manejar clic en notificación
  const handleNotificationClick = (notificacion) => {
    if (!notificacion.fechaLeido) {
      markAsRead(notificacion.idNotificacion);
    }
    setSelectedNotification(notificacion);
  };

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          Notificaciones {unreadCount > 0 && `(${unreadCount})`}
        </Dropdown.Toggle>

        <Dropdown.Menu className={styles.dropdownMenu}>
          {notificaciones.length > 0 ? (
            notificaciones.slice(0, 5).map((notificacion) => (
              <Dropdown.Item
                key={notificacion.idNotificacion}
                className={`${styles.notificacionItem} ${
                  !notificacion.fechaLeido ? styles.sinLeer : ""
                }`}
                onClick={() => handleNotificationClick(notificacion)}
              >
                {notificacion.descripcion}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item>No tienes notificaciones</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

      {/* Mostrar ventana emergente */}
      {selectedNotification  && (
        
        <VentanaEmergente
          titulo="Notificación"
          texto={selectedNotification.descripcion}
          fecha={Date(selectedNotification.fecha).toString().split("T")[0]}          
          onClose={() => setSelectedNotification(null)}
        />
        
      ) }
     
    </div>
  );
};

export default Notificaciones;
