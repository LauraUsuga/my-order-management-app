import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Order } from "@/interfaces/order";
import { User } from "@/interfaces/user";
import { Product } from "@/interfaces/product";
import { startOfMonth, endOfMonth } from "date-fns";

export async function getMetrics() {
  try {
    const ordersRef = collection(db, "pedidos");
    const usersRef = collection(db, "usuarios");
    const productsRef = collection(db, "productos");

    const ordersSnapshot = await getDocs(ordersRef);
    const orders: Order[] = ordersSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Order)
    );

    const usersSnapshot = await getDocs(usersRef);
    const users: User[] = usersSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as User)
    );

    const productsSnapshot = await getDocs(productsRef);
    const products: Product[] = productsSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Product)
    );

    const numOrders = orders.length;

    const numUsers = users.length;

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    const lastMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.fecha);
      return orderDate >= startOfCurrentMonth && orderDate <= endOfCurrentMonth;
    });
    const incomeLastMonth = lastMonthOrders.reduce((total, order) => {
      const orderTotal = Array.isArray(order.productos)
        ? order.productos.reduce((subtotal, product) => {
            return subtotal + product.valor * product.cantidad;
          }, 0)
        : 0;
      return total + orderTotal;
    }, 0);

    const cityCount = orders.reduce((count, order) => {
      count[order.cliente.ciudad] = (count[order.cliente.ciudad] || 0) + 1;
      return count;
    }, {} as Record<string, number>);

    const cityMoreOrders = Object.keys(cityCount).reduce((a, b) =>
      cityCount[a] > cityCount[b] ? a : b
    );

    const productCount = orders
      .flatMap((order) => order.productos)
      .reduce((count, product) => {
        count[product.id] = (count[product.id] || 0) + product.cantidad;
        return count;
      }, {} as Record<string, number>);

    const productMostSoldId = Object.keys(productCount).reduce((a, b) =>
      productCount[a] > productCount[b] ? a : b
    );
    const productMostSold =
      (console.log("Products:", productMostSoldId),
      products.find((product) => product.id === productMostSoldId)?.nombre ||
        "");

    return {
      numOrders,
      numUsers,
      incomeLastMonth,
      cityMoreOrders,
      productMostSold,
    };
  } catch (error) {
    console.error("Error obteniendo métricas:", error);
    throw error;
  }
}
