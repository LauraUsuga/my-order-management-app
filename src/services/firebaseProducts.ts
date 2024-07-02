import { Product } from "@/interfaces/product";
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

export async function getProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "productos"));
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Product)
    );
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
}

export async function createProduct(newProduct: Product): Promise<Product> {
  try {
    const docRef = await addDoc(collection(db, "productos"), newProduct);
    const productCreated = await getDoc(docRef);
    return { id: docRef.id, ...productCreated.data() } as Product;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
}

export async function productUpdated(
  id: string,
  productData: Partial<Product>
): Promise<Product | null> {
  try {
    const productDocRef = doc(db, "productos", id);
    await updateDoc(productDocRef, productData);
    const productUpdated = await getDoc(productDocRef);
    if (productUpdated.exists()) {
      return { id, ...productUpdated.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error(`Error al actualizar producto ${id}:`, error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const productDocRef = doc(db, "productos", id);
    await deleteDoc(productDocRef);
  } catch (error) {
    console.error(`Error al eliminar producto ${id}:`, error);
    throw error;
  }
}
