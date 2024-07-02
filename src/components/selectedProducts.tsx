import { Product } from "@/interfaces/product";
import React, { useState } from "react";
import styles from "../app/page.module.css";
import { formatNumber } from "@/utils/formatNumber";

interface SelectedProductsProps {
  productos: {
    product: Product;
    cantidad: number;
  }[];
  setProductos: React.Dispatch<
    React.SetStateAction<
      {
        product: Product;
        cantidad: number;
      }[]
    >
  >;
}

const SelectedProducts = ({
  productos,
  setProductos,
}: SelectedProductsProps) => {
  const handleRemoveProduct = (productId: string) => {
    const updatedProducts = productos.filter(
      (item) => item.product.id !== productId
    );
    setProductos(updatedProducts);
  };
  const handleQuantityChange = (productId: string, newCantidad: number) => {
    if (newCantidad <= 0) {
      handleRemoveProduct(productId);
    } else {
      const updatedProducts = productos.map((item) =>
        item.product.id === productId
          ? { ...item, cantidad: newCantidad }
          : item
      );
      setProductos(updatedProducts);
    }
  };
  return (
    <div>
      <ul>
        {productos.map((item, index) => (
          <li className={styles.selectedList} key={index}>
            {item.product.nombre}
            <div className={styles.qtyButton}>
              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(item.product.id ?? "", item.cantidad - 1)
                }
              >
                -
              </button>
              <p style={{ width: "22px", textAlign: "center" }}>
                {item.cantidad}
              </p>
              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(item.product.id ?? "", item.cantidad + 1)
                }
                disabled={item.cantidad >= item.product.inventario}
              >
                +
              </button>
            </div>
            {formatNumber(item.product.valor * item.cantidad)}
            <button
              type="button"
              onClick={() => handleRemoveProduct(item.product.id ?? "")}
              className={styles.deleteButton}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedProducts;
