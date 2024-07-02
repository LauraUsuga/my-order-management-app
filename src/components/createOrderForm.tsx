import React, { useEffect, useState } from "react";
import UserCreateOrder from "./userCreateOrder";
import AditionalInformationOrder from "./aditionalInformationOrder";
import SelectedProducts from "./selectedProducts";
import styles from "../app/page.module.css";
import { Product } from "@/interfaces/product";
import { ShippingRule, Status } from "@/interfaces/order";
import { User } from "@/interfaces/user";
import { getProducts, productUpdated } from "@/services/firebaseProducts";
import { getUsers, UserUpdated } from "@/services/firebaseUsers";
import { createOrder } from "@/services/firebaseOrders";
import { formatNumber } from "@/utils/formatNumber";

const CreateOrderForm = () => {
  const [fecha] = useState(new Date().toISOString().split("T")[0]);
  const [estado, setEstado] = useState<Status>("pendiente");
  const [pago, setPago] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [nombreCliente, setNombreCliente] = useState("");
  const [celularCliente, setCelularCliente] = useState<number>(0);
  const [correoCliente, setCorreoCliente] = useState<string>("");
  const [direccionCliente, setDireccionCliente] = useState("");
  const [ciudadCliente, setCiudadCliente] = useState("");
  const [productos, setProductos] = useState<
    { product: Product; cantidad: number }[]
  >([]);
  const [reglaEnvio, setReglaEnvio] = useState<ShippingRule>("domicilio");
  const [observaciones, setObservaciones] = useState("");
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setAvailableProducts(products);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchProducts();
    fetchUsers();
  }, []);

  useEffect(() => {
    0;
    const isDataValid =
      nombreCliente !== "" &&
      celularCliente !== 0 &&
      direccionCliente !== "" &&
      ciudadCliente !== "" &&
      productos.length > 0;
    setIsFormValid(isDataValid);
  }, [
    nombreCliente,
    celularCliente,
    direccionCliente,
    ciudadCliente,
    productos,
  ]);

  const handleUserSelect = (userId: string) => {
    const selected = users.find((user) => user.id === userId);
    if (selected) {
      setSelectedUser(selected);
      setNombreCliente(selected.nombre);
      setCelularCliente(selected.celular);
      setCorreoCliente(selected.correo);
      setDireccionCliente(selected.direccion);
      setCiudadCliente(selected.ciudad);
    }
  };
  const handleUserUpdate = async () => {
    if (selectedUser) {
      try {
        const updatedUser = await UserUpdated(selectedUser.id, {
          nombre: nombreCliente,
          celular: celularCliente ?? null,
          correo: correoCliente,
          direccion: direccionCliente,
          ciudad: ciudadCliente,
        });
        if (updatedUser) {
          console.log("Usuario actualizado:", updatedUser);
        } else {
          console.error("No se pudo actualizar el usuario.");
        }
      } catch (error) {
        console.error(
          `Error al actualizar el usuario ${selectedUser.id}:`,
          error
        );
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const newOrder = {
        fecha: fecha,
        estado,
        pago,
        cliente: {
          nombre: nombreCliente,
          celular: celularCliente,
          correo: correoCliente,
          direccion: direccionCliente,
          ciudad: ciudadCliente,
        },
        productos: productos.map((item) => ({
          id: item.product.id,
          nombre: item.product.nombre,
          valor: item.product.valor,
          cantidad: item.cantidad,
        })),
        reglaEnvio,
        observaciones,
      };

      const orderCreated = await createOrder(newOrder);

      if (orderCreated) {
        console.log("Orden creada");
        setNombreCliente("");
        setCelularCliente(0);
        setCorreoCliente("");
        setDireccionCliente("");
        setCiudadCliente("");
        setProductos([]);
        setReglaEnvio("domicilio");
        setObservaciones("");
        setEstado("pendiente");
        setPago(false);
        await Promise.all(
          productos.map(async (item) => {
            await productUpdated(item.product.id ?? "", {
              inventario: item.product.inventario - item.cantidad,
            });
          })
        );
      } else {
        console.error("Error al crear la orden");
      }
    } catch (error) {
      console.error("Error al crear la orden:", error);
    }
  };

  const handleAddProduct = (product: Product | undefined) => {
    if (product) {
      const existingProduct = productos.find(
        (item) => item.product.id === product.id
      );
      if (existingProduct) {
        const updatedProducts = productos.map((item) =>
          item.product.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
        setProductos(updatedProducts);
      } else {
        setProductos([...productos, { product, cantidad: 1 }]);
      }
    } else {
      console.error("Producto no encontrado");
    }
  };

  const getTotalOrden = () => {
    return productos.reduce(
      (total, item) => total + item.product.valor * item.cantidad,
      0
    );
  };
  return (
    <form onSubmit={handleSubmit} className={styles.listProductForm}>
      <label className={styles.selectLabel}>
        Seleccione Cliente
        <select
          onChange={(e) => handleUserSelect(e.target.value)}
          className={styles.select}
        >
          <option value="">Seleccione un cliente</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nombre}
            </option>
          ))}
        </select>
      </label>
      <p>Fecha: {fecha}</p>
      <UserCreateOrder
        celularCliente={celularCliente}
        ciudadCliente={ciudadCliente}
        correoCliente={correoCliente}
        direccionCliente={direccionCliente}
        nombreCliente={nombreCliente}
        setCelularCliente={setCelularCliente}
        setCiudadCliente={setCiudadCliente}
        setCorreoCliente={setCorreoCliente}
        setDireccionCliente={setDireccionCliente}
        setNombreCliente={setNombreCliente}
      />
      <button
        type="button"
        onClick={handleUserUpdate}
        className={styles.button}
      >
        Actualizar Cliente
      </button>
      <AditionalInformationOrder />
      <label>
        Productos Disponibles
        <select
          className={styles.select}
          onChange={(e) =>
            handleAddProduct(
              availableProducts.find((product) => product.id === e.target.value)
            )
          }
        >
          <option value="">Seleccionar Producto</option>
          {availableProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.nombre}
            </option>
          ))}
        </select>
      </label>
      <h2 style={{ marginTop: "10px" }}>Productos Seleccionados</h2>
      <SelectedProducts productos={productos} setProductos={setProductos}/>
      <h2 style={{ marginTop: "20px" }}>
        Total a pagar: {formatNumber(getTotalOrden())}
      </h2>
      <label>
        Observaciones
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </label>
      <button type="submit" disabled={!isFormValid} className={styles.button}>
        Crear Orden
      </button>
    </form>
  );
};

export default CreateOrderForm;
