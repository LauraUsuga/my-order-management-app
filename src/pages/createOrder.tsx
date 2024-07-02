import Navigation from "@/app/navigation";
import "../app/globals.css";
import styles from "../app/page.module.css";
import CreateOrderForm from "@/components/createOrderForm";

export default function CreateOrder() {
  return (
    <div>
      <Navigation />
      <div className={styles.containerListProduct}>
        <h1>Crear Pedido</h1>
        <CreateOrderForm />
      </div>
    </div>
  );
}
