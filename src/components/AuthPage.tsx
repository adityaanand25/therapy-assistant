import { useState } from "react";
import { authService } from "../lib/authService";

interface AuthPageProps {
  onAuth: (email: string) => void;
}

export function AuthPage({ onAuth }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isSignUp) {
      // Handle registration
      const success = authService.register(email, password, name);
      if (success) {
        // Auto login after successful registration
        const loginResult = authService.login(email, password);
        if (loginResult.success) {
          onAuth(email);
        } else {
          setError("Registration successful but login failed. Please try logging in.");
          // Switch to login form after successful registration
          setIsSignUp(false);
          setPassword(""); // Clear password for security
        }
      } else {
        setError("Email already registered. Please try logging in.");
        setIsSignUp(false); // Switch to login form
      }
    } else {
      // Handle login
      const result = authService.login(email, password);
      if (result.success) {
        onAuth(email);
      } else {
        setError(result.message);
      }
    }
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setSuccess("");
    setPassword(""); // Clear password when switching modes
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 pattern-dots bg-auth-pattern">
      <div className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-xl shadow-lg max-w-md w-full backdrop-blur-sm hover-lift">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ExamPrepAI
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isSignUp ? "Create an account to get started" : "Welcome back"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="John Doe"
                required={isSignUp}
                minLength={2}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleToggleMode}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}