import styles from "../app/page.module.css";

interface UserCreateOrderProps {
  nombreCliente: string;
  setNombreCliente: React.Dispatch<React.SetStateAction<string>>;
  celularCliente: number;
  setCelularCliente: React.Dispatch<React.SetStateAction<number>>;
  correoCliente: string;
  setCorreoCliente: React.Dispatch<React.SetStateAction<string>>;
  direccionCliente: string;
  setDireccionCliente: React.Dispatch<React.SetStateAction<string>>;
  ciudadCliente: string;
  setCiudadCliente: React.Dispatch<React.SetStateAction<string>>;
}

const UserCreateOrder = ({
  nombreCliente,
  setNombreCliente,
  celularCliente,
  setCelularCliente,
  correoCliente,
  setCorreoCliente,
  direccionCliente,
  setDireccionCliente,
  ciudadCliente,
  setCiudadCliente,
}: UserCreateOrderProps) => {
  return (
    <div className={styles.userOrder}>
      <p>Datos del cliente</p>
      <label>
        Nombre y Apellidos
        <input
          type="text"
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
          required
        />
      </label>
      <div className={styles.dobleLabel}>
        <label style={{ marginRight: "15px" }}>
          Celular
          <input
            type="number"
            value={celularCliente}
            onChange={(e) => setCelularCliente(Number(e.target.value))}
            required
          />
        </label>
        <label>
          Correo
          <input
            type="email"
            value={correoCliente}
            onChange={(e) => setCorreoCliente(e.target.value)}
          />
        </label>
      </div>
      <div className={styles.dobleLabel}>
        <label style={{ marginRight: "15px" }}>
          Dirección
          <input
            type="text"
            value={direccionCliente}
            onChange={(e) => setDireccionCliente(e.target.value)}
            required
          />
        </label>
        <label>
          Ciudad
          <input
            type="text"
            value={ciudadCliente}
            onChange={(e) => setCiudadCliente(e.target.value)}
            required
          />
        </label>
      </div>
    </div>
  );
};

export default UserCreateOrder;
