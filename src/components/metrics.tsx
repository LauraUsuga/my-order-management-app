import { useEffect, useState } from "react";
import styles from "../app/page.module.css";
import { formatNumber } from "@/utils/formatNumber";
import { getMetrics } from "@/services/firebaseMetrics";

interface Metrics {
  numOrders: number;
  numUsers: number;
  incomeLastMonth: number;
  cityMoreOrders: string;
  productMostSold: string;
}

const Metrics = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metricsData = await getMetrics();
        setMetrics(metricsData);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  if (!metrics) {
    return <div>Cargando...</div>;
  }
  return (
    <div>
      <h1>Métricas de Desempeño</h1>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <h3>Número de pedidos</h3>
          <p>{metrics.numOrders}</p>
        </div>
        <div className={styles.metric}>
          <h3>Número de clientes</h3>
          <p>{metrics.numUsers}</p>
        </div>
        <div className={styles.metric}>
          <h3>Ingresos del último mes</h3>
          <p>{formatNumber(metrics.incomeLastMonth)}</p>
        </div>
        <div className={styles.metric}>
          <h3>Ciudad con más pedidos</h3>
          <p>{metrics.cityMoreOrders}</p>
        </div>
        <div className={styles.metric}>
          <h3>Producto más vendido</h3>
          <p>{metrics.productMostSold}</p>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
