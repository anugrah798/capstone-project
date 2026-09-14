import { useState } from "react";
import { Link } from "react-router-dom";
import {
    FiLock,
    FiMail,
    FiShield,
    FiKey,
    FiCheckCircle,
    FiArrowLeft,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";

import api from "../services/api";
import "./ForgotPassword.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [step, setStep] = useState(1);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function sendOtp(e) {
        e.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await api.post(
                "/auth/forgot-password",
                { email }
            );

            setMessage(response.data.message);
            setStep(2);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to send OTP"
            );
        } finally {
            setLoading(false);
        }
    }

    async function verifyOtp(e) {
        e.preventDefault();

        setError("");
        setMessage("");

        if (otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/auth/verify-reset-otp",
                {
                    email,
                    otp,
                }
            );

            setMessage(response.data.message);
            setStep(3);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid OTP"
            );
        } finally {
            setLoading(false);
        }
    }

    async function resetPassword(e) {
        e.preventDefault();

        setError("");
        setMessage("");

        if (newPassword.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/auth/reset-password",
                {
                    email,
                    newPassword,
                }
            );

            setMessage(response.data.message);

            setTimeout(() => {
                window.location.href = "/login";
            }, 1800);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to reset password"
            );
        } finally {
            setLoading(false);
        }
    }

    function stepIcon(number) {
        if (number === 1) return <FiMail />;
        if (number === 2) return <FiShield />;
        return <FiKey />;
    }

    return (
        <main className="forgot-page">
            <div className="forgot-card">

                {/* Header */}
                <div className="forgot-header">
                    <div className="forgot-main-icon">
                        <FiLock />
                    </div>

                    <h1>Forgot Password?</h1>

                    <p>
                        Securely reset your SkySense AI password
                        using email verification.
                    </p>
                </div>

                {/* Progress */}
                <div className="forgot-progress">

                    {[1, 2, 3].map((number) => (
                        <div
                            className={`forgot-step ${step >= number ? "active" : ""
                                }`}
                            key={number}
                        >
                            <div className="step-circle">
                                {step > number ? (
                                    <FiCheckCircle />
                                ) : (
                                    stepIcon(number)
                                )}
                            </div>

                            <span>
                                {number === 1 && "Email"}
                                {number === 2 && "Verify OTP"}
                                {number === 3 && "Password"}
                            </span>
                        </div>
                    ))}

                </div>

                {/* Connector */}
                <div className="progress-line">
                    <span
                        style={{
                            width:
                                step === 1
                                    ? "0%"
                                    : step === 2
                                        ? "50%"
                                        : "100%",
                        }}
                    />
                </div>

                {/* Step 1 */}
                {step === 1 && (
                    <form
                        className="forgot-form"
                        onSubmit={sendOtp}
                    >
                        <div className="input-label">
                            <FiMail />
                            <label>Email Address</label>
                        </div>

                        <div className="forgot-input-wrapper">
                            <FiMail />

                            <input
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>

                        <button
                            className="forgot-primary-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                "Sending OTP..."
                            ) : (
                                <>
                                    Send Verification Code
                                    <span>→</span>
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <form
                        className="forgot-form"
                        onSubmit={verifyOtp}
                    >
                        <div className="otp-message">
                            <FiMail />

                            <div>
                                <strong>
                                    Check your email
                                </strong>

                                <p>
                                    We sent a 6-digit verification
                                    code to
                                    <br />
                                    <b>{email}</b>
                                </p>
                            </div>
                        </div>

                        <div className="input-label">
                            <FiShield />
                            <label>Verification Code</label>
                        </div>

                        <input
                            className="otp-input"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="000000"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 6)
                                )
                            }
                            required
                        />

                        <p className="otp-hint">
                            The code is valid for 10 minutes.
                        </p>

                        <button
                            className="forgot-primary-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                "Verifying..."
                            ) : (
                                <>
                                    Verify OTP
                                    <span>→</span>
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <form
                        className="forgot-form"
                        onSubmit={resetPassword}
                    >
                        <div className="input-label">
                            <FiKey />
                            <label>New Password</label>
                        </div>

                        <div className="forgot-input-wrapper">
                            <FiLock />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword ? (
                                    <FiEyeOff />
                                ) : (
                                    <FiEye />
                                )}
                            </button>
                        </div>

                        <p className="password-hint">
                            Your password must contain at least
                            6 characters.
                        </p>

                        <button
                            className="forgot-primary-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                "Resetting Password..."
                            ) : (
                                <>
                                    Reset Password
                                    <span>✓</span>
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Messages */}
                {message && (
                    <div className="forgot-success">
                        <FiCheckCircle />
                        <span>{message}</span>
                    </div>
                )}

                {error && (
                    <div className="forgot-error">
                        <span>!</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Back */}
                <Link
                    to="/login"
                    className="forgot-back"
                >
                    <FiArrowLeft />
                    Back to Login
                </Link>

            </div>
        </main>
    );
}