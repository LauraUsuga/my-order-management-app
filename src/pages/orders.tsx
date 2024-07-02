import Navigation from "@/app/navigation";
import { useEffect, useState } from "react";
import "../app/globals.css";
import styles from "../app/page.module.css";
import { Order } from "@/interfaces/order";
import { getOrders } from "@/services/firebaseOrders";
import OrdersTable from "@/components/ordersTable";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 7;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getOrders();
        const sortedOrders = fetchedOrders.sort((a, b) => {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    const filtered = orders.filter((order) =>
      order.productos.some(
        (product) =>
          product.nombre.toLowerCase().includes(value) ||
          order.fecha.toLowerCase().includes(value) ||
          order.cliente.nombre.toLowerCase().includes(value) ||
          (order.id && order.id.toLowerCase().includes(value))
      )
    );
    const sortedFiltered = filtered.sort((a, b) => {
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });
    setFilteredOrders(sortedFiltered);
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navigation />
      <div className={styles.main} style={{ justifyContent: "flex-start" }}>
        <h1 style={{ marginBottom: "50px" }}>Pedidos realizados</h1>
        <input
          className={styles.select}
          style={{ marginBottom: "50px", width: "100%" }}
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Filtrar por producto, fecha, nombre de cliente o número de orden"
        />
        {message && <p>{message}</p>}
        <OrdersTable
          currentPage={currentPage}
          filteredOrders={filteredOrders}
          orders={orders}
          ordersPerPage={ordersPerPage}
          setFilteredOrders={setFilteredOrders}
          setMessage={setMessage}
          setOrders={setOrders}
        />
        <div className={styles.pagination}>
          {Array.from(
            { length: Math.ceil(filteredOrders.length / ordersPerPage) },
            (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={
                  currentPage === index + 1 ? styles.activePage : styles.page
                }
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
