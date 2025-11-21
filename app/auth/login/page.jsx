'use client'

import React, { useState, useEffect, useMemo } from 'react';
// NOTE: In a real Next.js environment, these would be external imports:
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { signIn } from "@/lib/auth";
// 

// --- Password Strength Logic ---
const checkPasswordStrength = (password) => {
    if (!password || password.length === 0) {
        return { score: 0, label: "Empty", color: "bg-gray-400", width: "w-0" };
    }

    let score = 0;
    const metRequirements = [];

    // Minimum length check
    if (password.length >= 8) {
        metRequirements.push('length');
    }
    // Lowercase check
    if (/[a-z]/.test(password)) {
        metRequirements.push('lower');
    }
    // Uppercase check
    if (/[A-Z]/.test(password)) {
        metRequirements.push('upper');
    }
    // Number check
    if (/\d/.test(password)) {
        metRequirements.push('number');
    }
    // Symbol check
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        metRequirements.push('symbol');
    }

    const metCount = metRequirements.length;

    // Assign score based on met criteria
    if (metCount >= 4 && password.length >= 10) {
        score = 4; // Strongest
    } else if (metCount >= 3) {
        score = 3; // Good
    } else if (metCount >= 2) {
        score = 2; // Fair
    } else {
        score = 1; // Weak
    }

    const strengthMap = {
        0: { label: "Empty", color: "bg-gray-400", width: "w-0" },
        1: { label: "Weak", color: "bg-red-500", width: "w-1/4" },
        2: { label: "Fair", color: "bg-orange-500", width: "w-2/4" },
        3: { label: "Good", color: "bg-yellow-500", width: "w-3/4" },
        4: { label: "Strong", color: "bg-green-500", width: "w-full" },
    };

    return strengthMap[score];
};
// --- End of Strength Logic ---


// --- Password Strength Indicator Component ---
const PasswordStrengthIndicator = ({ strength }) => {
    const widthClass = strength.width;

    return (
        <div className="mt-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-in-out ${strength.color} ${widthClass}`}
                    role="progressbar"
                    aria-valuenow={strength.score}
                    aria-valuemin="0"
                    aria-valuemax="4"
                    aria-label={`Password strength: ${strength.label}`}
                ></div>
            </div>
            <p className={`text-xs font-semibold mt-1 transition-colors duration-300 ${
                strength.color.replace('bg-', 'text-')
            }`}>
                {strength.label !== 'Empty' ? `Strength: ${strength.label}` : ''}
            </p>
        </div>
    );
};
// --- End of Password Strength Indicator Component ---


export default function App() {
    // We call the simulated hook here
    const { push: routerPush, isAuthenticated } = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate strength using useMemo to optimize
    const passwordStrength = useMemo(() => checkPasswordStrength(password), [password]);

    const handleError = (err) => {
        // IMPORTANT: We use the custom UI error display instead of the forbidden alert()
        console.error(err);
        setError(err.message || "An unknown error occurred.");
    };

    async function handleSignIn(e) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            // Uses the simulated external signIn function
            await signIn(email, password);
            // Uses the simulated external router.push function
            routerPush("/dashboard");
        } catch (err) {
            handleError(err);
        } finally {
            setIsSubmitting(false);
        }
    }



    if (isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="max-w-md w-full p-8 bg-white shadow-xl rounded-2xl text-center">
                    <h1 className="text-3xl font-bold text-green-600 mb-4">Success!</h1>
                    <p className="text-gray-600">You are now signed in. Simulating redirection to the dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
            <div className="max-w-md w-full p-8 bg-white shadow-2xl rounded-xl border border-gray-200">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
                    Welcome Back
                </h1>

                {/* Error Message Box */}
                {error && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        <span className="font-medium">Authentication Failed:</span> {error}
                    </div>
                )}

                <form className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <input
                            placeholder="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-500"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-500"
                            required
                        />
                        {/* Password Strength Indicator */}
                        <PasswordStrengthIndicator strength={passwordStrength} />
                    </div>

                    {/* Sign In Button */}
                    <button
                        onClick={handleSignIn}
                        disabled={isSubmitting || !email || !password}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    {/* Links */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                            Don&apos;t have an account? Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}