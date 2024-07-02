import React, { useState } from "react";
import styles from "../app/page.module.css";
import { ShippingRule, Status } from "@/interfaces/order";

const AditionalInformationOrder = () => {
  const [estado, setEstado] = useState<Status>("pendiente");
  const [reglaEnvio, setReglaEnvio] = useState<ShippingRule>("domicilio");
  const [pago, setPago] = useState(false);


  return (
    <div className={styles.dobleLabel}>
      <label>
        Estado
        <select
          className={styles.select}
          value={estado}
          onChange={(e) => setEstado(e.target.value as Status)}
        >
          <option value="pendiente">Pendiente</option>
          <option value="en ruta">En Ruta</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </label>
      <label style={{ marginLeft: "20px" }}>
        Regla de Envío
        <select
          className={styles.select}
          value={reglaEnvio}
          onChange={(e) => setReglaEnvio(e.target.value as ShippingRule)}
        >
          <option value="domicilio">Domicilio</option>
          <option value="recoge en punto">Recoge en Punto</option>
        </select>
      </label>
      <label className={styles.checkbox} style={{ marginLeft: "20px" }}>
        Pago
        <select
          value={pago ? "true" : "false"}
          onChange={(e) => setPago(e.target.value === "true")}
          className={styles.select}
        >
          <option value="true">Pago realizado</option>
          <option value="false">No se realizo el pago</option>
        </select>
      </label>
    </div>
  );
};

export default AditionalInformationOrder;
