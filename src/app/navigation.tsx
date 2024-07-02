import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

const Navigation: React.FC = () => {
  return (
    <div className={styles.nav}>
      <p>BK</p>
      <nav>
        <ul>
          <li>
            <Link href="/">Inicio</Link>
          </li>
          <li>
            <Link href="/orders">Pedidos</Link>
          </li>
          <li>
            <Link href="/createOrder">Crear Pedido</Link>
          </li>
          <li>
            <Link href="/clients">Clientes</Link>
          </li>
          <li>
            <Link href="/createClient">Crear Cliente</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
