import { Order, Status } from "@/interfaces/order";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

export async function getOrders(): Promise<Order[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "pedidos"));
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Order)
    );
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    throw error;
  }
}

export async function createOrder(newOrder: Order): Promise<Order> {
  try {
    const docRef = await addDoc(collection(db, "pedidos"), newOrder);
    const orderCreated = await getDoc(docRef);
    return { id: docRef.id, ...orderCreated.data() } as Order;
  } catch (error) {
    console.error("Error al crear pedido:", error);
    throw error;
  }
}

export async function orderUpdated(
  id: string,
  estado: Status
): Promise<Order | null> {
  console.log(id)
  try {
    const orderDocRef = doc(db, "pedidos", id);
    await updateDoc(orderDocRef, { estado });
    const orderStatustUpdated = await getDoc(orderDocRef);
    if (orderStatustUpdated.exists()) {
      return { id, ...orderStatustUpdated.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error(`Error al actualizar pedido ${id}:`, error);
    throw error;
  }
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    const orderDocRef = doc(db, "pedidos", id);
    await deleteDoc(orderDocRef);
  } catch (error) {
    console.error(`Error al eliminar pedido ${id}:`, error);
    throw error;
  }
}
