import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LifeBuoy, Search, BookOpen, MessageSquare, Phone, Mail, ChevronRight, Ticket, LogIn, Settings, User } from 'lucide-react';
import { Auth } from './components/Auth';
import { Chat } from './components/Chat';
import { CreateTicket } from './components/CreateTicket';
import { AdminPanel } from './components/AdminPanel';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, user } = useAuth();

  const categories = [
    {
      title: 'Частые вопросы',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'Ответы на популярные вопросы'
    },
    {
      title: 'Техническая поддержка',
      icon: <LifeBuoy className="w-6 h-6" />,
      description: 'Помощь с техническими проблемами'
    },
    {
      title: 'Онлайн чат',
      icon: <MessageSquare className="w-6 h-6" />,
      description: 'Мгновенная поддержка в чате',
      link: '/chat'
    }
  ];

  const popularQuestions = [
    'Как сбросить пароль?',
    'Проблемы с входом в систему',
    'Как обновить программу?',
    'Настройка уведомлений'
  ];

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-blue-600 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <LifeBuoy className="w-8 h-8" />
                <h1 className="text-2xl font-bold">ТехПоддержка</h1>
              </Link>
              <div className="flex items-center space-x-4">
                <Link to="/create-ticket" className="flex items-center hover:text-blue-200">
                  <Ticket className="w-5 h-5 mr-1" />
                  Создать тикет
                </Link>
                {isAuthenticated ? (
                  <>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center hover:text-blue-200">
                        <Settings className="w-5 h-5 mr-1" />
                        Админ панель
                      </Link>
                    )}
                    <button className="flex items-center hover:text-blue-200">
                      <User className="w-5 h-5 mr-1" />
                      {user.name}
                    </button>
                  </>
                ) : (
                  <Link to="/auth" className="flex items-center hover:text-blue-200">
                    <LogIn className="w-5 h-5 mr-1" />
                    Войти
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/chat" element={
            <div className="container mx-auto px-4 py-8">
              <Chat />
            </div>
          } />
          <Route path="/create-ticket" element={
            <div className="container mx-auto px-4 py-8">
              <CreateTicket />
            </div>
          } />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={
            <>
              {/* Hero Section with Search */}
              <div className="bg-blue-600 text-white pb-16">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl mx-auto text-center py-12">
                    <h2 className="text-4xl font-bold mb-4">Как мы можем помочь?</h2>
                    <p className="text-blue-100 mb-8">Найдите ответы на ваши вопросы или свяжитесь с нашей службой поддержки</p>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Поиск по базе знаний..."
                        className="w-full px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="container mx-auto px-4 -mt-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {categories.map((category, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="text-blue-600">
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                          <p className="text-gray-600 mb-4">{category.description}</p>
                          {category.link ? (
                            <Link to={category.link} className="flex items-center text-blue-600 hover:text-blue-700">
                              Перейти
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          ) : (
                            <button className="flex items-center text-blue-600 hover:text-blue-700">
                              Подробнее
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Questions */}
              <div className="container mx-auto px-4 py-16">
                <h2 className="text-2xl font-bold mb-8">Популярные вопросы</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {popularQuestions.map((question, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow">
                      <a href="#" className="flex items-center justify-between text-gray-800 hover:text-blue-600">
                        <span>{question}</span>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-gray-100">
                <div className="container mx-auto px-4 py-16">
                  <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold mb-4">Свяжитесь с нами</h2>
                    <p className="text-gray-600">Наша команда поддержки готова помочь вам</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg p-6 shadow flex items-center space-x-4">
                      <Phone className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Телефон</h3>
                        <p className="text-gray-600">8-800-123-45-67</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow flex items-center space-x-4">
                      <Mail className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-gray-600">support@example.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          } />
        </Routes>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-300">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <LifeBuoy className="w-6 h-6" />
                <span className="font-bold">ТехПоддержка</span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-white">Условия использования</a>
                <a href="#" className="hover:text-white">Политика конфиденциальности</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;