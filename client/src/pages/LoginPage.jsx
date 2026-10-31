import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Campus infrastructure management</p>
        <h1>CampusFix2.0</h1>
        <h2>Sign in</h2>
        <p>Students and administrators use the same secure login.</p>

        {errorMessage && (
          <div className="feedback feedback--error" role="alert">
            {errorMessage}
          </div>
        )}

        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-field form-field--wide">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-field form-field--wide">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            className="primary-button form-field--wide"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

      </section>
    </main>
  );
}

export default LoginPage;
