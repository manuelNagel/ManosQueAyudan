import React from "react";
import useProyectoConActividades from "../../hooks/useProyectoConActividades";
import Kanban from "./Kanban";

const ProyectoKanban = ({ idProyecto }) => {
  const { proyecto, loading, error } = useProyectoConActividades(idProyecto);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const actividades = proyecto?.actividades || [];

  return (
    <div>
      <h1>{proyecto.nombre}</h1>
      <Kanban actividades={actividades} />
    </div>
  );
};

export default ProyectoKanban;
