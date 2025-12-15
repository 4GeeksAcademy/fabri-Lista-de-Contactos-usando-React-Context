import { Link } from "react-router-dom";
import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import ContactCard from "../components/ContactCard.jsx";


const API_BASE = "https://playground.4geeks.com/contact";
const AGENDA_SLUG = "fabri_agenda";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer();





	const loadContactsFromApi = async () => {
		try {

			let resp = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}/contacts`);

			if (resp.status === 404) {
				await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}`, { method: "POST" });
				resp = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}/contacts`);
			}

			console.log("GET contactos, status:", resp.status);


			if (!resp.ok) {
				console.error("Error al hacer GET contactos:", resp.status);
				return;
			}


			const data = await resp.json();
			console.log("GET contactos, data:", data);


			const list = Array.isArray(data) ? data : data.contacts;

			if (!Array.isArray(list)) {
				console.error("Formato inesperado de contactos:", data);
				return;
			}


			dispatch({
				type: "set_contacts",
				payload: list
			});

		} catch (error) {
			console.error("Error cargando contactos desde la API:", error);
		}
	};


	useEffect(() => {
		loadContactsFromApi();
	}, []);

	return (
		<div className="container mt-4">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h1 className="h3">Contact list</h1>

				<Link to="/add">
					<button className="btn btn-success" type="button">
						Agregar contacto
					</button>
				</Link>
			</div>

			{store.contacts.length === 0 ? (
				<div className="alert alert-light">
					No hay contactos todavía.
				</div>
			) : (
				store.contacts.map((c) => (
					<ContactCard key={c.id} contact={c} />
				))
			)}
		</div>
	);
};