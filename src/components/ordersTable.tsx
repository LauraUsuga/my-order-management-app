import { formatNumber } from "@/utils/formatNumber";
import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "../app/page.module.css";
import { Order, Status } from "@/interfaces/order";
import { orderUpdated } from "@/services/firebaseOrders";

interface OrdersTableProps {
  orders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>;
  setMessage: Dispatch<SetStateAction<string>>;
  setFilteredOrders: Dispatch<SetStateAction<Order[]>>;
  currentPage: number;
  ordersPerPage: number;
  filteredOrders: Order[];
}

const OrdersTable = ({
  orders,
  setOrders,
  setMessage,
  setFilteredOrders,
  currentPage,
  ordersPerPage,
  filteredOrders,
}: OrdersTableProps) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<Status>("pendiente");
  const handleUpdateStatus = async () => {
    if (selectedOrderId) {
      try {
        const updatedOrder = await orderUpdated(
          selectedOrderId,
          selectedStatus
        );
        if (updatedOrder) {
          setMessage("Orden actualizada");
          setTimeout(() => setMessage(""), 5000);
          const updatedOrders = orders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          );
          const sortedUpdatedOrders = updatedOrders.sort((a, b) => {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime(); // Ordenar por fecha descendente
          });
          setOrders(sortedUpdatedOrders);
          setFilteredOrders(sortedUpdatedOrders);
          setSelectedOrderId("");
        } else {
          console.error("No se pudo actualizar la orden.");
        }
      } catch (error) {
        console.error(
          `Error al actualizar la orden ${selectedOrderId}:`,
          error
        );
      }
    }
  };
  const handleStatusChange = (orderId: string, newStatus: Status) => {
    setSelectedOrderId(orderId);
    setSelectedStatus(newStatus);
  };
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Número de Orden</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Pago</th>
          <th>Cliente</th>
          <th>Ciudad</th>
          <th>Productos</th>
          <th>Regla de Envío</th>
          <th>Observaciones</th>
        </tr>
      </thead>
      <tbody>
        {currentOrders.map((order) => (
          <tr key={order.id}>
            <td>#{order.id}</td>
            <td>{order.fecha}</td>
            <td>
              <select
                className={styles.select}
                value={
                  selectedOrderId === order.id ? selectedStatus : order.estado
                }
                onChange={(e) =>
                  handleStatusChange(order.id ?? "", e.target.value as Status)
                }
              >
                <option value="pendiente">Pendiente</option>
                <option value="en ruta">En Ruta</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              {selectedOrderId === order.id && (
                <button className={styles.button} onClick={handleUpdateStatus}>
                  Actualizar Estado
                </button>
              )}
            </td>
            <td>{order.pago ? "Pagado" : "Pendiente"}</td>
            <td>{order.cliente.nombre}</td>
            <td>{order.cliente.ciudad}</td>
            <td>
              <ul>
                {order.productos.map((product) => (
                  <li key={product.id}>
                    {product.nombre} X{product.cantidad}{" "}
                    {formatNumber(product.valor * product.cantidad)}
                  </li>
                ))}
              </ul>
            </td>
            <td>{order.reglaEnvio}</td>
            <td>{order.observaciones}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;
