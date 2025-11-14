import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    }
    setLoading(false);
  };

  // const handleResetPassword = async () => {
  //   if (!form.email) {
  //     setError("Please enter your email to reset password.");
  //     return;
  //   }
  //   try {
  //     await sendPasswordResetEmail(auth, form.email);
  //     alert("Password reset email sent. Check your inbox.");
  //   } catch (err) {
  //     setError("Failed to send reset email.", err);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-primary">Login</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}

        <div className="relative">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="peer w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Email"
            required
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            className="peer w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold bg-blue-900 hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <p>
            Forgot Password?{" "}
            <Link to="/register" className="text-blue-800 hover:underline">
              Register
            </Link>
          </p>
          <p>
            No account?{" "}
            <Link to="/resetpswd" className="text-blue-800 hover:underline">
              Reset
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
