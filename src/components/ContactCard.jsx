import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

const API_BASE = "https://playground.4geeks.com/contact";
const AGENDA_SLUG = "fabri_agenda";

const ContactCard = ({ contact }) => {

    const { dispatch } = useGlobalReducer();

    
    const handleDelete = async () => {
        const confirmDelete = window.confirm(`¿Seguro que quieres borrar a ${contact.name}?`);
        if (!confirmDelete) return;

        try {
            
            const resp = await fetch(
                `${API_BASE}/agendas/${AGENDA_SLUG}/contacts/${contact.id}`,
                { method: "DELETE" }
            );

            console.log("DELETE status:", resp.status);

            if (!resp.ok) {
                console.error("Error al borrar contacto en la API:", resp.status);
                return;
            }

            
            dispatch({
                type: "delete_contact",
                payload: contact.id
            });

        } catch (error) {
            console.error("Error en handleDelete:", error);
        }
    };

    return (
        <div className="card mb-3 p-3 d-flex flex-row justify-content-between align-items-center">

            <div className="text-start">
                <h5 className="mb-1">{contact.name}</h5>
                <div className="text-muted">{contact.address}</div>
                <div className="text-muted">{contact.phone}</div>
                <div className="text-muted">{contact.email}</div>
            </div>

            <div className="d-flex gap-2">

                <Link
                    to={`/edit/${contact.id}`}
                    className="btn btn-outline-secondary btn-sm"
                >
                    Editar✏️
                </Link>

                <button
                    className="btn btn-outline-danger btn-sm"
                    type="button"
                    onClick={handleDelete}
                >
                    Borrar🗑️
                </button>
            </div>
        </div>
    );
};

export default ContactCard;