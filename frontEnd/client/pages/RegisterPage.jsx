import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { UserPlus, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({ name: cleanName, email: cleanEmail, password });
      // Redirect to login with pre-populated email & success banner
      navigate("/login", {
        replace: true,
        state: {
          registeredEmail: cleanEmail,
          message: "Account created successfully! Please sign in with your password.",
        },
      });
    } catch (err) {
      let serverError =
        err?.response?.data?.error ||
        err?.response?.data?.message;

      if (!serverError) {
        if (!err.response || err.message === 'Network Error' || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
          serverError = 'Backend server is waking up from sleep mode (Render Free Tier). Please wait a moment and click Create Account again.';
        } else {
          serverError = 'Registration failed. Please try again.';
        }
      }
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      <div className="w-full max-w-md">

        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
             <UserPlus size={24} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Create Account</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Join AgroVision smart agriculture today
          </p>
        </div>

        {/* Card Section */}
        <div className="px-6 py-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl sm:px-10">

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 mb-6 text-sm text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50 rounded-lg bg-rose-50 dark:bg-rose-950/40 animate-fade-in">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <p className="leading-snug">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-200">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                autoFocus
                className="block w-full px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg h-11 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm"
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-slate-900 dark:text-slate-200 font-medium text-sm">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="block w-full px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg h-11 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-200">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="block w-full px-3 py-2 pr-10 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg h-11 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && password.length < 6 ? (
                <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400">Password must be at least 6 characters.</p>
              ) : password.length >= 6 ? (
                <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Secure password length
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full px-4 mt-2 text-sm font-medium text-white transition-all rounded-lg h-11 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;