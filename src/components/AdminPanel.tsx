import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Ticket, Search, Filter, MoreVertical, Edit, Trash2, UserPlus, CheckCircle, XCircle, AlertCircle, Clock, MessageSquare, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Status = 'new' | 'in_progress' | 'resolved' | 'closed';

interface TicketMessage {
  id: string;
  content: string;
  createdAt: string;
  isAdmin: boolean;
  userName: string;
}

interface Ticket {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: Status;
  createdAt: string;
  description: string;
  messages: TicketMessage[];
  user: {
    name: string;
    email: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface TicketModalProps {
  ticket: Ticket;
  onClose: () => void;
  onStatusChange: (status: Status) => void;
  onSendMessage: (message: string) => void;
}

function TicketModal({ ticket, onClose, onStatusChange, onSendMessage }: TicketModalProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 flex justify-between items-start border-b">
          <div>
            <h2 className="text-2xl font-bold mb-2">{ticket.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>От: {ticket.user.name}</span>
              <span>•</span>
              <span>{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Описание:</h3>
            <p className="text-gray-700">{ticket.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Статус:</h3>
              <select
                value={ticket.status}
                onChange={(e) => onStatusChange(e.target.value as Status)}
                className="border rounded-lg px-3 py-1 text-sm"
              >
                <option value="new">Новый</option>
                <option value="in_progress">В работе</option>
                <option value="resolved">Решен</option>
                <option value="closed">Закрыт</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Переписка:</h3>
            {ticket.messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg ${
                  message.isAdmin
                    ? 'bg-blue-50 ml-8'
                    : 'bg-gray-50 mr-8'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{message.userName}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700">{message.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

interface UserModalProps {
  user?: User;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
}

function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(userData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {user ? 'Редактировать пользователя' : 'Создать пользователя'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имя
            </label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Роль
            </label>
            <select
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value as 'user' | 'admin' })}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {user ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminPanel() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tickets' | 'users'>('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [userModalData, setUserModalData] = useState<{ user?: User; isOpen: boolean }>({
    isOpen: false
  });
  
  // Пример данных
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: 'Проблема с входом',
      category: 'technical',
      priority: 'high',
      status: 'new',
      description: 'Не могу войти в систему уже второй день. Пробовал сбросить пароль, но письмо не приходит.',
      createdAt: '2024-03-15T10:30:00',
      messages: [
        {
          id: '1',
          content: 'Не могу войти в систему уже второй день.',
          createdAt: '2024-03-15T10:30:00',
          isAdmin: false,
          userName: 'Иван Петров'
        }
      ],
      user: {
        name: 'Иван Петров',
        email: 'ivan@example.com'
      }
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Иван Петров',
      email: 'ivan@example.com',
      role: 'user',
      createdAt: '2024-03-10T08:00:00'
    }
  ]);

  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/auth');
    }
  }, [isAuthenticated, user, navigate]);

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'new':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'in_progress':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleStatusChange = (ticketId: string, newStatus: Status) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    ));
  };

  const handleTicketMessageSend = (ticketId: string, message: string) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          messages: [
            ...ticket.messages,
            {
              id: Date.now().toString(),
              content: message,
              createdAt: new Date().toISOString(),
              isAdmin: true,
              userName: user?.name || 'Администратор'
            }
          ]
        };
      }
      return ticket;
    }));
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter(ticket => ticket.id !== ticketId));
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (userModalData.user) {
      // Обновление существующего пользователя
      setUsers(users.map(u =>
        u.id === userModalData.user.id ? { ...u, ...userData } : u
      ));
    } else {
      // Создание нового пользователя
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name!,
        email: userData.email!,
        role: userData.role || 'user',
        createdAt: new Date().toISOString()
      };
      setUsers([...users, newUser]);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Заголовок */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'tickets'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('tickets')}
              >
                <div className="flex items-center space-x-2">
                  <Ticket className="w-5 h-5" />
                  <span>Тикеты</span>
                </div>
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('users')}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Пользователи</span>
                </div>
              </button>
            </div>
          </div>

          {/* Поиск и фильтры */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-sm relative">
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            
            {activeTab === 'tickets' && (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Все статусы</option>
                    <option value="new">Новые</option>
                    <option value="in_progress">В работе</option>
                    <option value="resolved">Решенные</option>
                    <option value="closed">Закрытые</option>
                  </select>
                  <Filter className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <button
                onClick={() => setUserModalData({ isOpen: true })}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <UserPlus className="w-5 h-5" />
                <span>Создать пользователя</span>
              </button>
            )}
          </div>

          {/* Таблица тикетов */}
          {activeTab === 'tickets' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Заголовок
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Пользователь
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Приоритет
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{ticket.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {ticket.title}
                        </button>
                        <div className="text-sm text-gray-500">
                          {ticket.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ticket.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(ticket.status)}
                          <select
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket.id, e.target.value as Status)}
                            className="ml-2 text-sm text-gray-900 border-0 bg-transparent focus:ring-0"
                          >
                            <option value="new">Новый</option>
                            <option value="in_progress">В работе</option>
                            <option value="resolved">Решен</option>
                            <option value="closed">Закрыт</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : ticket.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTicket(ticket.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Таблица пользователей */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Имя
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Роль
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата регистрации
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setUserModalData({ user, isOpen: true })}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно тикета */}
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onStatusChange={(status) => {
            handleStatusChange(selectedTicket.id, status);
          }}
          onSendMessage={(message) => {
            handleTicketMessageSend(selectedTicket.id, message);
          }}
        />
      )}

      {/* Модальное окно пользователя */}
      {userModalData.isOpen && (
        <UserModal
          user={userModalData.user}
          onClose={() => setUserModalData({ isOpen: false })}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}