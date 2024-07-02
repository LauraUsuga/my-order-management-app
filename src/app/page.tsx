"use client";
import Metrics from "@/components/metrics";
import styles from "./page.module.css";
import { ProductList } from "@/components/productList";

export default function Home() {
  return (
    <main className={styles.main}>
      <Metrics />
      <ProductList />
    </main>
  );
}
