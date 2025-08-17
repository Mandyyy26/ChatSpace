import React, { useState } from 'react';
import { 
  useSignInEmailPassword, 
  useSignUpEmailPassword 
} from '@nhost/react';
import { Navigate } from 'react-router-dom';
import { useAuthenticationStatus } from '@nhost/react';
import { 
  MessageCircle, 
  Mail, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [isSignUp, setIsSignUp]               = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [verificationEmail, setVerificationEmail]             = useState('');

  // pull needsEmailVerification from both hooks
  const {
    signInEmailPassword,
    needsEmailVerification: signInNeedsVerification,
    isLoading: signInLoading,
    error: signInError
  } = useSignInEmailPassword();

  const {
    signUpEmailPassword,
    needsEmailVerification: signUpNeedsVerification,
    isLoading: signUpLoading,
    error: signUpError
  } = useSignUpEmailPassword();

  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      const result = await signUpEmailPassword(email, password, {
        redirectTo: `${window.location.origin}/verify-email`
      });

      // show verification screen after sign-up
      if (result.needsEmailVerification || signUpNeedsVerification) {
        setShowVerificationMessage(true);
        setVerificationEmail(email);
        setEmail('');
        setPassword('');
      }
      return;
    }

    // sign-in flow
    const result = await signInEmailPassword(email, password);

    // show verification screen if email not yet verified
    if (result.needsEmailVerification || signInNeedsVerification) {
      setShowVerificationMessage(true);
      setVerificationEmail(email);
      setEmail('');
      setPassword('');
      return;
    }

    // other sign-in errors will display in the form below
    if (result.isError) {
      return;
    }

    // on success, isAuthenticated flips true and triggers redirect above
  };

  const isSubmitting = signInLoading || signUpLoading;
  const error       = isSignUp ? signUpError : signInError;

  // —— Verification Pending UI ——
  if (showVerificationMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Email!
            </h2>
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-gray-700 mb-2">
                We've sent a verification email to:
              </p>
              <p className="text-blue-600 font-semibold mb-4">
                {verificationEmail}
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Check your inbox and click the verification link to activate your account.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                    <div className="w-3 h-3 border-2 border-gray-400 rounded-sm flex items-center justify-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Don't see the email? </span>
                    <span className="font-semibold">Check your spam/junk folder.</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowVerificationMessage(false);
                setIsSignUp(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // —— Sign In / Sign Up Form ——
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Join ChatApp' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isSignUp
                ? 'Create your account to start chatting'
                : 'Sign in to continue your conversations'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={isSignUp ? 6 : undefined}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
              />
              {isSignUp && (
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long.
                </p>
              )}
            </div>

            {/* errors */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-800">
                    {isSignUp
                      ? (error.message.includes('email-already-in-use')
                          ? 'An account with this email already exists. Please sign in instead.'
                          : error.message)
                      : (error.message.includes('email-not-verified')
                          ? 'Please verify your email address before signing in.'
                          : error.message)}
                  </p>
                </div>
              </div>
            )}

            {/* sign-up tip */}
            {isSignUp && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    After signing up, check your inbox for a verification link to activate your account.
                  </p>
                </div>
              </div>
            )}

            {/* submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>

            {/* toggle */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmail('');
                  setPassword('');
                }}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
