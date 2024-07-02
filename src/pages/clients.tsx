"use client";
import Navigation from "@/app/navigation";
import React, { useState, useEffect } from "react";
import "../app/globals.css";
import { User } from "@/interfaces/user";
import { deleteUser, getUsers } from "@/services/firebaseUsers";
import styles from "../app/page.module.css";

const ITEMS_PER_PAGE = 3;

export default function Clients() {
  const [clients, setClients] = useState<User[]>([]);
  const [filteredClients, setFilteredClients] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getUsers();
        setClients(clientsData);
        setFilteredClients(clientsData);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const filterClients = () => {
      let filtered = clients;

      if (nameFilter) {
        filtered = filtered.filter((client) =>
          client.nombre.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      if (emailFilter) {
        filtered = filtered.filter((client) =>
          client.correo.toLowerCase().includes(emailFilter.toLowerCase())
        );
      }

      if (cityFilter) {
        filtered = filtered.filter((client) =>
          client.ciudad.toLowerCase().includes(cityFilter.toLowerCase())
        );
      }

      setFilteredClients(filtered);
      setCurrentPage(1);
    };

    filterClients();
  }, [nameFilter, emailFilter, cityFilter, clients]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedClients = filteredClients.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);

  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteUser(clientId);
      const updatedClients = clients.filter((client) => client.id !== clientId);
      setClients(updatedClients);
      setFilteredClients(updatedClients);
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  return (
    <div>
      <Navigation />
      <div className={styles.containerUsers}>
        <h2>Clientes</h2>
        <h3 style={{ textAlign: "left", margin: "20px 0", width: "100%" }}>
          Filtrar por:
        </h3>
        <div className={styles.containerFilterUser}>
          <label>
            Nombre:
            <input
              className={styles.userInput}
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </label>
          <label>
            Correo:
            <input
              className={styles.userInput}
              type="text"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
            />
          </label>
          <label>
            Ciudad:
            <input
              className={styles.userInput}
              type="text"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </label>
        </div>
        <div className={styles.clientCards}>
          {displayedClients.map((client) => (
            <div key={client.id} className={styles.clientCard}>
              <div>
                <h4>{client.nombre}</h4>
                <p>
                  Correo electrónico: <b>{client.correo}</b>
                </p>
                <p>
                  Celular: <b>{client.celular}</b>
                </p>
                <p>
                  Dirección: <b>{client.direccion}</b>
                </p>
                <p>
                  Ciudad: <b>{client.ciudad}</b>
                </p>
              </div>
              <button className={styles.button} style={{ width: "30%" }} onClick={() => handleDeleteClient(client.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={currentPage === page}
              >
                {page}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
