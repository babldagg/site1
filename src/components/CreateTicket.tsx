import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TicketForm {
  title: string;
  category: string;
  priority: string;
  description: string;
  image?: File | null;
}

export function CreateTicket() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [ticket, setTicket] = useState<TicketForm>({
    title: '',
    category: 'technical',
    priority: 'medium',
    description: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Файл слишком большой. Максимальный размер: 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, загрузите изображение');
        return;
      }

      setTicket({ ...ticket, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setTicket({ ...ticket, image: null });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика создания тикета с изображением
    console.log('Ticket created:', ticket);
  };

  if (!isAuthenticated) {
    return null; // Компонент не рендерится для неавторизованных пользователей
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Создать тикет</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Тема
          </label>
          <input
            type="text"
            id="title"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={ticket.title}
            onChange={(e) => setTicket({...ticket, title: e.target.value})}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Категория
          </label>
          <select
            id="category"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={ticket.category}
            onChange={(e) => setTicket({...ticket, category: e.target.value})}
          >
            <option value="technical">Техническая проблема</option>
            <option value="billing">Оплата</option>
            <option value="account">Аккаунт</option>
            <option value="other">Другое</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Приоритет
          </label>
          <select
            id="priority"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={ticket.priority}
            onChange={(e) => setTicket({...ticket, priority: e.target.value})}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
            <option value="urgent">Срочный</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Описание проблемы
          </label>
          <textarea
            id="description"
            rows={4}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={ticket.description}
            onChange={(e) => setTicket({...ticket, description: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Прикрепить изображение
          </label>
          
          {!imagePreview ? (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Загрузить файл</span>
                    <input
                      id="image-upload"
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">или перетащите</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF до 5MB
                </p>
              </div>
            </div>
          ) : (
            <div className="relative mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Создать тикет
          </button>
        </div>
      </form>
    </div>
  );
}