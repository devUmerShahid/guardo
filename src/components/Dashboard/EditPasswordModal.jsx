import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function EditPasswordModal({ isOpen, onClose, existingData, onUpdate }) {
  const [resourceName, setResourceName] = useState("");
  const [loginUrl, setLoginUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Update state when existingData is provided
  useEffect(() => {
    if (existingData) {
      setResourceName(existingData.resourceName || "");
      setLoginUrl(existingData.loginUrl || "");
      setUsername(existingData.username || "");
      setPassword(existingData.password || "");
    }
  }, [existingData]);

  const handleSave = async () => {
    if (!existingData) return;

    try {
      const ref = doc(db, "passwords", existingData.id);

      await updateDoc(ref, {
        resourceName,
        loginUrl,
        username,
        password
      });

      onUpdate(existingData.id, { resourceName, loginUrl, username, password });
      onClose();
    } catch (error) {
      console.error("Firestore update failed:", error);
    }
  };

  if (!isOpen || !existingData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Password</h2>

        <div className="space-y-4">
          <input
            className="w-full border px-3 py-2 rounded"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            placeholder="Resource Name"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={loginUrl}
            onChange={(e) => setLoginUrl(e.target.value)}
            placeholder="Login URL"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded bg-blue-900 hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
