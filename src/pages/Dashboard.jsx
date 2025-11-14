import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import Navbar from "@/components/Dashboard/Navbar";
import StatsCards from "@/components/Dashboard/StatsCards";
import PasswordList from "@/components/Dashboard/PasswordList";
import AddPasswordModal from "@/components/Dashboard/AddPasswordModal";
import { db } from "@/firebase/config";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

const Dashboard = () => {
  const { user, logout } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [passwords, setPasswords] = useState([]);

  // Fetch passwords live from Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "passwords"),
      where("userId", "==", user.uid),
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

  // Add new password handler
  const handleAddPassword = (newPassword) => {
    setPasswords((prev) => [newPassword, ...prev]);
  };

  // Delete password handler
  const handleDeletePassword = (id) => {
    setPasswords((prev) => prev.filter((p) => p.id !== id));
  };

  // Edit password handler
  const handleEditPassword = (id, updatedData) => {
    setPasswords((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
  };

  // Filter passwords based on search
  const filteredPasswords = passwords.filter(
    (item) =>
      item.resourceName?.toLowerCase().includes(search.toLowerCase()) ||
      item.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        onLogout={logout}
        onAddClick={() => setIsModalOpen(true)}
        search={search}
        setSearch={setSearch}
      />

      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <StatsCards passwords={passwords} />
        <PasswordList
          passwords={filteredPasswords}
          onDelete={handleDeletePassword}
          onEdit={handleEditPassword}
        />
      </div>

      {isModalOpen && (
        <AddPasswordModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddPassword}
        />
      )}
    </div>
  );
};

export default Dashboard;
