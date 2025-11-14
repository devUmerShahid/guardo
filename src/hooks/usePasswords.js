import { useState, useEffect } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthContext } from "@/context/AuthContext";

export const usePasswords = () => {
  const { user } = useAuthContext();
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all passwords for the logged-in user
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "passwords"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPasswords(data);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ Add new password entry
  const addPassword = async (passwordData) => {
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "passwords"), {
        ...passwordData,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding password:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { passwords, addPassword, loading };
};
