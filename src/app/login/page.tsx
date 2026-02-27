"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LoginPage() {
    const t = useTranslations("auth");
    const tApp = useTranslations("app");
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <div className="login-container">
            <div className="login-bg">
                <div className="login-bg-pattern" />
                <div className="login-bg-gradient" />
            </div>

            <div className="login-card animate-scale-in">
                {/* Logo & Brand */}
                <div className="login-header">
                    <div className="login-logo">
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect width="48" height="48" rx="12" fill="url(#logo-gradient)" />
                            <path
                                d="M14 34V18L24 12L34 18V34"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M20 34V26H28V34"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="24" cy="21" r="3" stroke="white" strokeWidth="2" />
                            <defs>
                                <linearGradient
                                    id="logo-gradient"
                                    x1="0"
                                    y1="0"
                                    x2="48"
                                    y2="48"
                                >
                                    <stop stopColor="#1e40af" />
                                    <stop offset="1" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1 className="login-title">{t("loginTitle")}</h1>
                    <p className="login-subtitle">{t("loginSubtitle")}</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="login-error animate-fade-in">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                        >
                            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110-1.5.75.75 0 010 1.5zM8.75 4.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            {t("email")}
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="admin@eduflow.eg"
                            required
                            autoComplete="email"
                            dir="ltr"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            {t("password")}
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                            dir="ltr"
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="login-spinner" />
                        ) : (
                            t("loginButton")
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="login-divider">
                    <span>{t("orContinueWith")}</span>
                </div>

                {/* Google Sign In */}
                <button
                    onClick={handleGoogleSignIn}
                    className="google-button"
                    type="button"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span>{t("google")}</span>
                </button>

                {/* Brand Footer */}
                <p className="login-footer">{tApp("name")}</p>
            </div>

            <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .login-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .login-bg-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            #0f172a 0%,
            #1e293b 30%,
            #1e40af 60%,
            #3b82f6 100%
          );
        }

        .login-bg-pattern {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-image: radial-gradient(
            circle at 30% 20%,
            rgba(59, 130, 246, 0.15) 0%,
            transparent 50%
          ),
          radial-gradient(
            circle at 70% 80%,
            rgba(245, 158, 11, 0.1) 0%,
            transparent 50%
          );
        }

        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .login-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .login-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #fee2e2;
          border: 1px solid #fca5a5;
          border-radius: var(--radius-md);
          color: #991b1b;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid var(--border-default);
          border-radius: var(--radius-md);
          font-size: 0.9375rem;
          background: white;
          color: var(--text-primary);
          transition: border-color var(--transition-fast),
            box-shadow var(--transition-fast);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .form-input::placeholder {
          color: var(--text-muted);
        }

        .login-button {
          width: 100%;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          font-size: 0.9375rem;
          font-weight: 600;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: opacity var(--transition-fast),
            transform var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          margin-top: 0.5rem;
        }

        .login-button:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-spinner {
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          color: var(--text-muted);
          font-size: 0.8125rem;
        }

        .login-divider::before,
        .login-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--border-default);
        }

        .google-button {
          width: 100%;
          padding: 0.625rem 1.5rem;
          background: white;
          border: 1.5px solid var(--border-default);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: background var(--transition-fast),
            border-color var(--transition-fast);
        }

        .google-button:hover {
          background: var(--bg-secondary);
          border-color: var(--text-muted);
        }

        .login-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}
