import React, { useState } from 'react';
import { Mail, Lock, User, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Администратор по умолчанию
const DEFAULT_ADMIN = {
  id: '0',
  email: 'admin@example.com',
  password: 'admin123',
  name: 'Администратор',
  role: 'admin' as const
};

export function Auth() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [verificationStep, setVerificationStep] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    verificationCode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !verificationStep) {
      // Здесь будет отправка кода подтверждения на email
      console.log('Sending verification code to:', formData.email);
      setVerificationStep(true);
    } else if (!isLogin && verificationStep) {
      // Здесь будет проверка кода и завершение регистрации
      console.log('Verifying code and completing registration:', formData);
    } else {
      // Проверка на администратора
      if (formData.email === DEFAULT_ADMIN.email && formData.password === DEFAULT_ADMIN.password) {
        login(DEFAULT_ADMIN);
        navigate('/');
      } else {
        // Здесь будет обычная логика авторизации
        console.log('Login form submitted:', formData);
      }
    }
  };

  const handleResendCode = () => {
    // Здесь будет повторная отправка кода
    console.log('Resending verification code to:', formData.email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Вход в систему' : (verificationStep ? 'Подтверждение email' : 'Регистрация')}
          </h2>
          {!isLogin && verificationStep && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Мы отправили код подтверждения на адрес {formData.email}
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && !verificationStep && (
              <div>
                <label htmlFor="name" className="sr-only">Имя</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Имя"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}
            
            {(!verificationStep || isLogin) && (
              <>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={`appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 ${!isLogin && !formData.name ? 'rounded-t-md' : ''} focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Пароль</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Пароль"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
              </>
            )}

            {!isLogin && verificationStep && (
              <div>
                <label htmlFor="verificationCode" className="sr-only">Код подтверждения</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    required
                    maxLength={6}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Введите код подтверждения"
                    value={formData.verificationCode}
                    onChange={(e) => setFormData({...formData, verificationCode: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLogin ? 'Войти' : (verificationStep ? 'Подтвердить' : 'Зарегистрироваться')}
            </button>

            {!isLogin && verificationStep && (
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Отправить код повторно
              </button>
            )}

            {!verificationStep && (
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setVerificationStep(false);
                  setFormData({
                    email: '',
                    password: '',
                    name: '',
                    verificationCode: ''
                  });
                }}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}