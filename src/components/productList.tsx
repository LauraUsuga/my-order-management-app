"use client";
import { Product } from "@/interfaces/product";
import React, { useState, useEffect } from "react";
import "../app/globals.css";
import {
  createProduct,
  deleteProduct,
  getProducts,
  productUpdated,
} from "@/services/firebaseProducts";
import styles from "../app/page.module.css";
import { formatNumber } from "@/utils/formatNumber";

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product>({
    id: "",
    nombre: "",
    valor: 0,
    inventario: 0,
  });
  const [newProduct, setNewProduct] = useState<Product>({
    nombre: "",
    valor: 0,
    inventario: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditedProduct({ ...product });
    setModalOpen(true);
  };

  const handleSaveChanges = async () => {
    if (selectedProduct) {
      try {
        const updatedProduct = await productUpdated(
          selectedProduct.id ?? "",
          editedProduct
        );
        if (updatedProduct) {
          const updatedProducts = products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          );
          setProducts(updatedProducts);
          setModalOpen(false);
          console.log("Producto actualizado correctamente:", updatedProduct);
        } else {
          console.error("No se pudo actualizar el producto.");
        }
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id ?? "");
        const updatedProducts = products.filter(
          (product) => product.id !== selectedProduct.id
        );
        setProducts(updatedProducts);
        setModalOpen(false);
        console.log("Producto eliminado correctamente:", selectedProduct);
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  const handleCreateProduct = () => {
    setCreateModalOpen(true);
    setNewProduct({
      nombre: "",
      valor: 0,
      inventario: 0,
    });
  };

  const handleSaveNewProduct = async () => {
    try {
      const createdProduct = await createProduct(newProduct);
      setProducts([...products, createdProduct]);
      setCreateModalOpen(false);
      console.log("Producto creado correctamente:", createdProduct);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]:
        name === "valor" || name === "inventario" ? parseInt(value, 10) : value,
    }));
  };

  const handleChangeNewProduct = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]:
        name === "valor" || name === "inventario" ? parseInt(value, 10) : value,
    }));
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h2>Nuestros Productos</h2>
        <button
          className={styles.button}
          style={{ width: "20%" }}
          onClick={handleCreateProduct}
        >
          Crear Producto Nuevo
        </button>
      </div>
      <div className={styles.productCardContainer}>
        {products.map((product) => (
          <div
            key={product.id}
            className={styles.productCard}
            onClick={() => handleEditProduct(product)}
          >
            <h4 className={styles.productCardTitle}>{product.nombre}</h4>
            <div style={{ marginBottom: "10px", fontSize: "20px" }}>
              {formatNumber(product.valor)}
            </div>
            <div style={{ fontSize: "20px" }}>
              Inventario: {product.inventario}
            </div>
          </div>
        ))}
      </div>
      {modalOpen && selectedProduct && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <h2>Editar Producto</h2>
              <span
                className={styles.close}
                onClick={() => setModalOpen(false)}
              >
                &times;
              </span>
            </div>
            <form>
              <label>
                Nombre:
                <input
                  className={styles.select}
                  type="text"
                  name="nombre"
                  value={editedProduct.nombre}
                  onChange={handleChange}
                />
              </label>
              <label>
                Valor:
                <input
                  className={styles.select}
                  type="number"
                  name="valor"
                  value={editedProduct.valor}
                  onChange={handleChange}
                />
              </label>
              <label>
                Inventario:
                <input
                  className={styles.select}
                  type="number"
                  name="inventario"
                  value={editedProduct.inventario}
                  onChange={handleChange}
                />
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  className={styles.button}
                  style={{ marginRight: "5px" }}
                  onClick={handleSaveChanges}
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  className={styles.deleteButton}
                  style={{ marginLeft: "5px", width: "100%" }}
                  onClick={handleDeleteProduct}
                >
                  Eliminar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {createModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <h2>Crear Nuevo Producto</h2>
              <span
                className={styles.close}
                onClick={() => setCreateModalOpen(false)}
              >
                &times;
              </span>
            </div>
            <form>
              <label>
                Nombre:
                <input
                  className={styles.select}
                  type="text"
                  name="nombre"
                  value={newProduct.nombre}
                  onChange={handleChangeNewProduct}
                />
              </label>
              <label>
                Valor:
                <input
                  className={styles.select}
                  type="number"
                  name="valor"
                  value={newProduct.valor}
                  onChange={handleChangeNewProduct}
                />
              </label>
              <label>
                Inventario:
                <input
                  className={styles.select}
                  type="number"
                  name="inventario"
                  value={newProduct.inventario}
                  onChange={handleChangeNewProduct}
                />
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  className={styles.button}
                  style={{ marginRight: "5px" }}
                  onClick={handleSaveNewProduct}
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
