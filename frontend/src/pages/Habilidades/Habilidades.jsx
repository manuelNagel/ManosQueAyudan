import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Habilidades = () => {
    const [habilidades, setHabilidades] = useState([]); // Lista de todas las habilidades disponibles
    const [selectedHabilidades, setSelectedHabilidades] = useState([]); // Habilidades seleccionadas por el usuario
    const { user, loading, updateUserProfile } = useAuth();

    // Cargar habilidades desde el backend
    useEffect(() => {
        const fetchHabilidades = async () => {
            try {
                const { data } = await axios.get(`/api/habilidades`);
                setHabilidades(data);
            } catch (error) {
                console.error("Error fetching habilidades:", error);
            }
        };

        const fetchUserHabilidades = async () => {
            if (!user?.id) return; // Asegurarse de que user y user.id estén definidos
            try {
                const { data } = await axios.get(
                    `/api/usuarios/${user.id}/habilidades`
                );
                setSelectedHabilidades(data.map((hab) => hab.idHabilidades));
            } catch (error) {
                console.error("Error fetching user habilidades:", error);
            }
        };

        fetchHabilidades();

        if (user) {
            fetchUserHabilidades();
        }
    }, [user]); // Agregar `user` como dependencia

    // Alternar la selección/deselección de habilidades
    const toggleHabilidad = (habilidadId) => {
        setSelectedHabilidades((prevSelected) =>
            prevSelected.includes(habilidadId)
                ? prevSelected.filter((id) => id !== habilidadId)
                : [...prevSelected, habilidadId]
        );
    };

    // Guardar cambios en el backend
    const handleSave = async () => {
        if (!user?.id) {
            alert("Usuario no definido");
            return;
        }

        try {
            await axios.put(
                `/api/usuarios/${user.id}/habilidades`,
                selectedHabilidades
            );
            alert("Habilidades actualizadas con éxito.");
        } catch (error) {
            console.error("Error updating habilidades:", error);
            alert("Hubo un error al actualizar las habilidades.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h2>Gestión de Habilidades</h2>
                <div className="list-group">
                    {habilidades.map((habilidad) => (
                        <label
                            key={habilidad.idHabilidades}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <span>{habilidad.nombre}</span>
                            <input
                                type="checkbox"
                                checked={selectedHabilidades.includes(
                                    habilidad.idHabilidades
                                )}
                                onChange={() => toggleHabilidad(habilidad.idHabilidades)}
                            />
                        </label>
                    ))}
                </div>
                <button className="btn btn-primary mt-3" onClick={handleSave}>
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
};

export default Habilidades;
