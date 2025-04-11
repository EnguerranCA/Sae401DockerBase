import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {getApiToken} from '../../lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getApiToken();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return <>{children}</>;
};