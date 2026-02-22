import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);

    const result = await register({
      username: form.username,
      email: form.email,
      password: form.password
    });

    setLoading(false);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.message);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-32">

      <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 shadow-xl">

        <h2 className="text-3xl font-bold text-center mb-8">
          Create Account
        </h2>

        {error && (
          <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-4 outline-none focus:border-purple-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-4 outline-none focus:border-purple-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-4 outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 py-4 rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </section>
  );
}