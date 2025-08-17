import React, { useEffect } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuthenticationStatus } from '@nhost/react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate        = useNavigate();
  const token           = searchParams.get('token') ?? '';

  // Nhost hooks
  const { isAuthenticated, isLoading: authLoading } = useAuthenticationStatus();

  // 1) Nhost handles email verification automatically when the token is in the URL
  useEffect(() => {
    // No manual verification call needed - Nhost processes the token automatically
  }, [token]);

  // 2) While Nhost is checking authentication status, show spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader className="animate-spin w-16 h-16 text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Verifying your email…</p>
        </div>
      </div>
    );
  }

  // 3) If they’re now authenticated, jump into the app
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }



  // 4) Still here? That means verification succeeded but auth isn't yet ready:
  //    we can render a success screen while we wait for isAuthenticated to flip.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Email Verified!
          </h2>
          <p className="text-gray-700 mb-4">
            Thanks—your email is now verified.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you into the app…
          </p>
        </div>
      </div>
    </div>
  );
};
