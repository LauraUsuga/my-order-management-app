import Navigation from "@/app/navigation";
import { Product } from "@/interfaces/product";
import { useState } from "react";
import "../app/globals.css";
import styles from "../app/page.module.css";
import { createProduct } from "@/services/firebaseProducts";

export default function CreateProduct() {
  const [nombre, setNombre] = useState("");
  const [valor, setValor] = useState(0);
  const [inventario, setInventario] = useState(0);
  const [id, setId] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const newProduct: Product = {
        id,
        nombre,
        valor,
        inventario,
      };

      const productoCreado = await createProduct(newProduct);

      if (productoCreado) {
        console.log("Producto creado");
      } else {
        console.error("Error al crear el producto");
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  return (
    <div>
      <Navigation />
      <div className={styles.containerListProduct}>
        <h1>Crear Nuevo Producto</h1>
        <form onSubmit={handleSubmit} className={styles.listProductForm}>
          <label>
            ID
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </label>
          <br />
          <label>
            Nombre
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Valor
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              required
            />
          </label>
          <br />
          <label>
            Inventario
            <input
              type="number"
              value={inventario}
              onChange={(e) => setInventario(Number(e.target.value))}
              required
            />
          </label>
          <br />
          <button type="submit">Crear Producto</button>
        </form>
      </div>
    </div>
  );
}
