import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuthContext } from "@/context/AuthContext";

const AddPasswordModal = ({ onClose }) => {
  const { user } = useAuthContext();

  const [formData, setFormData] = useState({
    resourceName: "",
    loginUrl: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Password Strength Checker
  const getPasswordStrength = (password) => {
    if (password.length > 10 && /[A-Z]/.test(password) && /\d/.test(password))
      return "strong";
    if (password.length >= 6) return "medium";
    return "weak";
  };

  // ✅ Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You must be logged in to add a password.");
      return;
    }

    const { resourceName, loginUrl, username, password, confirmPassword } =
      formData;

    if (!resourceName || !loginUrl || !username || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const strength = getPasswordStrength(password);

    try {
      setLoading(true);

      await addDoc(collection(db, "passwords"), {
        userId: user.uid,
        resourceName,
        loginUrl,
        username,
        password,
        strength,
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      onClose(); // close modal on success
    } catch (err) {
      console.error(err);
      setError("Failed to save password. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-xl p-6 relative">
        {/* Header */}
        <h2 className="text-xl font-semibold text-center mb-4 text-blue-600">
          Add New Password
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Resource Name*
            </label>
            <input
              type="text"
              name="resourceName"
              value={formData.resourceName}
              onChange={handleChange}
              placeholder="e.g. Netflix"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Login URL*
            </label>
            <input
              type="url"
              name="loginUrl"
              value={formData.loginUrl}
              onChange={handleChange}
              placeholder="e.g. https://netflix.com/login"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username / Email*
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username or email"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password*
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-8 text-sm text-gray-500 hover:text-blue-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password*
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Add Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPasswordModal;
