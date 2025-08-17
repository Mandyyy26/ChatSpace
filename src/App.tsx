import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NhostProvider } from '@nhost/react';
import { ApolloProvider } from '@apollo/client';
import { nhost } from './lib/nhost';
import { apolloClient } from './lib/apollo';
import { ProtectedRoute } from './components/ProtectedRoute';
import { TopBar } from './components/TopBar';
import { Login } from './pages/Login';
import { ChatList } from './pages/ChatList';
import { Thread } from './pages/Thread';
import { EmailVerification } from './components/EmailVerification';

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={apolloClient}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <div>
                      <TopBar />
                      <ChatList />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:chatId"
                element={
                  <ProtectedRoute>
                    <div>
                      <TopBar />
                      <Thread />
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </NhostProvider>
  );
}

export default App;