import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const API_BASE = "https://playground.4geeks.com/contact";
const AGENDA_SLUG = "fabri_agenda";

const AddContact = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const { id } = useParams();

    const editingId = id ? parseInt(id) : null;


    const contactToEdit = editingId
        ? store.contacts.find((c) => c.id === editingId)
        : null;


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });


    useEffect(() => {
        if (contactToEdit) {
            setFormData({
                name: contactToEdit.name || contactToEdit.full_name || "",
                email: contactToEdit.email || "",
                phone: contactToEdit.phone || "",
                address: contactToEdit.address || ""
            });
        }
    }, [contactToEdit]);


    const handleChange = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        setFormData({
            ...formData,
            [fieldName]: fieldValue
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();


        const contactPayload = {

            full_name: formData.name,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            agenda_slug: AGENDA_SLUG
        };

        try {
            let contactFromServer = null;

            if (editingId && contactToEdit) {

                const resp = await fetch(
                    `${API_BASE}/agendas/${AGENDA_SLUG}/contacts/${editingId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(contactPayload)
                    }
                );

                console.log("PUT status:", resp.status);

                if (!resp.ok) {
                    console.error("Error al actualizar contacto:", resp.status);
                    return;
                }

                contactFromServer = await resp.json();


                dispatch({
                    type: "update_contact",
                    payload: contactFromServer
                });

            } else {

                const resp = await fetch(
                    `${API_BASE}/agendas/${AGENDA_SLUG}/contacts`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(contactPayload)
                    }
                );

                console.log("POST status:", resp.status);

                if (!resp.ok) {
                    console.error("Error al crear contacto:", resp.status);
                    return;
                }

                contactFromServer = await resp.json();


                dispatch({
                    type: "add_contact",
                    payload: contactFromServer
                });
            }


            navigate("/");

        } catch (error) {
            console.error("Error en handleSubmit:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="h3 mb-3">
                {editingId ? "Editar contacto" : "Agregar nuevo contacto"}
            </h1>

            <form onSubmit={handleSubmit} className="d-grid gap-3">
                <input
                    className="form-control"
                    type="text"
                    name="name"
                    placeholder="Nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    className="form-control"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    className="form-control"
                    type="text"
                    name="phone"
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <input
                    className="form-control"
                    type="text"
                    name="address"
                    placeholder="Dirección"
                    value={formData.address}
                    onChange={handleChange}
                />

                <button className="btn btn-primary" type="submit">
                    {editingId ? "Guardar cambios" : "Guardar contacto"}
                </button>
            </form>
        </div>
    );
};

export default AddContact;