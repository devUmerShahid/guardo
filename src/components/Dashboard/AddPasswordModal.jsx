import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuthContext } from "@/context/AuthContext";

const AddPasswordModal = ({ onClose, onAdd }) => {
  const { user } = useAuthContext();

  const [formData, setFormData] = useState({
    resourceName: "",
    loginUrl: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    level: "none",
    score: 0,
    feedback: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Update password strength in real-time
    if (name === "password") {
      analyzePasswordStrength(value);
    }
  };

  const analyzePasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push("At least 8 characters");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("One uppercase letter");

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("One lowercase letter");

    if (/\d/.test(password)) score += 1;
    else feedback.push("One number");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push("One special character");

    let level = "none";
    if (password.length === 0) {
      level = "none";
    } else if (score <= 2) {
      level = "weak";
    } else if (score <= 4) {
      level = "medium";
    } else {
      level = "strong";
    }

    setPasswordStrength({
      level,
      score,
      feedback: password.length > 0 ? feedback : []
    });
  };

  const getPasswordStrength = (password) => {
    if (password.length > 10 && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "strong";
    if (password.length >= 8) return "medium";
    return "weak";
  };

  // const getStrengthColor = (level) => {
  //   switch (level) {
  //     case "strong": return "bg-emerald-500";
  //     case "medium": return "bg-amber-500";
  //     case "weak": return "bg-red-500";
  //     default: return "bg-gray-300";
  //   }
  // };

  const getStrengthText = (level) => {
    switch (level) {
      case "strong": return "Strong";
      case "medium": return "Medium";
      case "weak": return "Weak";
      default: return "Enter password";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { resourceName, loginUrl, username, password, confirmPassword } = formData;

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

      const docRef = await addDoc(collection(db, "passwords"), {
        userId: user.uid,
        resourceName,
        loginUrl,
        username,
        password,
        strength,
        createdAt: serverTimestamp(),
      });

      onAdd({
        id: docRef.id,
        userId: user.uid,
        resourceName,
        loginUrl,
        username,
        password,
        strength,
        createdAt: new Date(),
      });

      setLoading(false);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save password. Please try again.");
      setLoading(false);
    }
  };

  const generateStrongPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({
      ...formData,
      password,
      confirmPassword: password
    });
    analyzePasswordStrength(password);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative animate-in fade-in-90 zoom-in-90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add New Password</h2>
            <p className="text-gray-600 text-sm mt-1">Secure your login credentials</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <div className="text-red-500 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-700 text-sm flex-1">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Resource Name */}
            <input
              type="text"
              name="resourceName"
              placeholder="Resource Name *"
              value={formData.resourceName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            />

            {/* Login URL */}
            <input
              type="url"
              name="loginUrl"
              placeholder="Login URL *"
              value={formData.loginUrl}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            />

            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder="Username / Email *"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            />

            {/* Password */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password *"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                  >
                    Generate
                  </button>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm whitespace-nowrap"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.level === "strong" ? "text-emerald-600" :
                      passwordStrength.level === "medium" ? "text-amber-600" :
                      passwordStrength.level === "weak" ? "text-red-600" : "text-gray-600"
                    }`}>
                      {getStrengthText(passwordStrength.level)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        passwordStrength.level === "strong" ? "bg-emerald-500" :
                        passwordStrength.level === "medium" ? "bg-amber-500" :
                        passwordStrength.level === "weak" ? "bg-red-500" : "bg-gray-300"
                      }`}
                      style={{ 
                        width: passwordStrength.level === "strong" ? "100%" :
                               passwordStrength.level === "medium" ? "66%" :
                               passwordStrength.level === "weak" ? "33%" : "0%" 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password *"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors text-sm"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                loading 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Add Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPasswordModal;








// import { useState } from "react";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "@/firebase/config";
// import { useAuthContext } from "@/context/AuthContext";

// const AddPasswordModal = ({ onClose, onAdd }) => {
//   const { user } = useAuthContext();

//   const [formData, setFormData] = useState({
//     resourceName: "",
//     loginUrl: "",
//     username: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const getPasswordStrength = (password) => {
//     if (password.length > 10 && /[A-Z]/.test(password) && /\d/.test(password))
//       return "strong";
//     if (password.length >= 6) return "medium";
//     return "weak";
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const { resourceName, loginUrl, username, password, confirmPassword } =
//       formData;

//     if (!resourceName || !loginUrl || !username || !password) {
//       setError("Please fill in all required fields.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     const strength = getPasswordStrength(password);

//     try {
//       setLoading(true);

//       const docRef = await addDoc(collection(db, "passwords"), {
//         userId: user.uid,
//         resourceName,
//         loginUrl,
//         username,
//         password,
//         strength,
//         createdAt: serverTimestamp(),
//       });

//       // Update Dashboard state
//       onAdd({
//         id: docRef.id,
//         userId: user.uid,
//         resourceName,
//         loginUrl,
//         username,
//         password,
//         strength,
//         createdAt: new Date(),
//       });

//       setLoading(false);
//       onClose();
//     } catch (err) {
//       console.error(err);
//       setError("Failed to save password. Try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-xl p-6 relative">
//         <h2 className="text-xl font-semibold text-center mb-4 text-blue-600">
//           Add New Password
//         </h2>

//         {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="resourceName"
//             placeholder="Resource Name*"
//             value={formData.resourceName}
//             onChange={handleChange}
//             className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//           <input
//             type="url"
//             name="loginUrl"
//             placeholder="Login URL*"
//             value={formData.loginUrl}
//             onChange={handleChange}
//             className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//           <input
//             type="text"
//             name="username"
//             placeholder="Username / Email*"
//             value={formData.username}
//             onChange={handleChange}
//             className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password*"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((prev) => !prev)}
//               className="absolute right-3 top-2 text-gray-500 hover:text-blue-600"
//             >
//               {showPassword ? "Hide" : "Show"}
//             </button>
//           </div>
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm Password*"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//           />

//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
//                 loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loading ? "Saving..." : "Add Password"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddPasswordModal;
