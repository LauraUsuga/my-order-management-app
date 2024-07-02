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
import { User } from "@/interfaces/user";

export async function getUsers(): Promise<User[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as User)
    );
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
}

export async function createUser(newUser: User): Promise<User> {
  try {
    const docRef = await addDoc(collection(db, "usuarios"), newUser);
    const UserCreated = await getDoc(docRef);
    return { id: docRef.id, ...UserCreated.data() } as User;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
}

export async function UserUpdated(id: string, userData: Partial<User>): Promise<User | null> {
  try {
    const userDocRef = doc(db, "usuarios", id);
    await updateDoc(userDocRef, userData);

    const userAfterUpdate = await getDoc(userDocRef);

    if (userAfterUpdate.exists()) {
      return { id, ...userAfterUpdate.data() } as User;
    }
    return null;
  } catch (error) {
    console.error(`Error al actualizar usuario ${id}:`, error);
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    const UserDocRef = doc(db, "usuarios", id);
    await deleteDoc(UserDocRef);
  } catch (error) {
    console.error(`Error al eliminar usuario ${id}:`, error);
    throw error;
  }
}
