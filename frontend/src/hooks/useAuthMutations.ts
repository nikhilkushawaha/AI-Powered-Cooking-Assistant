import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { LoginData, SignupData } from '../types';

export const useSignup = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: SignupData) => authApi.signup(data),
    onSuccess: (response) => {
      setAuth(response.user, response.token);
      navigate('/chat');
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.token);
      navigate('/chat');
    },
  });
};
