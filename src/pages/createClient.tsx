import Navigation from "@/app/navigation";
import { useEffect, useState } from "react";
import "../app/globals.css";
import styles from "../app/page.module.css";
import { createUser } from "@/services/firebaseUsers";
import { User } from "@/interfaces/user";

export default function CreateClient() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState<number | undefined>(undefined);
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (nombre && correo && celular && direccion && ciudad) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [nombre, correo, celular, direccion, ciudad]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const newClient: Omit<User, "id"> = {
        nombre,
        correo,
        celular: celular!,
        direccion,
        ciudad,
      };

      const clientCreated = await createUser(newClient as User);

      if (clientCreated) {
        console.log("Cliente creado:", clientCreated);

        setNombre("");
        setCorreo("");
        setCelular(0);
        setDireccion("");
        setCiudad("");
      } else {
        console.error("Error al crear el cliente");
      }
    } catch (error) {
      console.error("Error al crear el cliente:", error);
    }
  };

  return (
    <div>
      <Navigation />
      <div className={styles.containerUsers}>
        <h1>Crear Nuevo Cliente</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre
            <input
              className={styles.select}
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>
          <label>
            Correo
            <input
              className={styles.select}
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </label>
          <label>
            Celular
            <input
              className={styles.select}
              type="number"
              value={celular}
              onChange={(e) => setCelular(Number(e.target.value))}
              required
            />
          </label>
          <label>
            Dirección
            <input
              className={styles.select}
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
          </label>
          <label>
            Ciudad
            <input
              className={styles.select}
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            disabled={!isFormValid}
            className={styles.button}
          >
            Crear Cliente
          </button>
        </form>
      </div>
    </div>
  );
}
