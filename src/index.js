import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';

// Комплексная обработка ошибок для Telegram WebView
const setupErrorHandling = () => {
  // Обработка JavaScript ошибок
  window.addEventListener('error', (event) => {
    console.error('Global JavaScript error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
    
    // Предотвращаем показ overlay с ошибками в dev режиме
    event.preventDefault();
    return true;
  });

  // Обработка необработанных промисов
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });

  // Специальная обработка для React ошибок
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Фильтруем React DevTools ошибки в production
    if (process.env.NODE_ENV === 'production') {
      const errorString = args.join(' ');
      if (errorString.includes('Warning:') || 
          errorString.includes('React DevTools') ||
          errorString.includes('Download the React DevTools')) {
        return;
      }
    }
    originalConsoleError.apply(console, args);
  };

  // Обработка ошибок сети
  window.addEventListener('offline', () => {
    console.warn('App went offline');
  });

  window.addEventListener('online', () => {
    console.log('App went online');
  });
};

// Инициализация обработки ошибок
setupErrorHandling();

// Создание корневого элемента
const root = ReactDOM.createRoot(document.getElementById('root'));

// Компонент с обработкой ошибок
const AppWithErrorBoundary = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
};

// Рендер приложения с обработкой ошибок
try {
  root.render(<AppWithErrorBoundary />);
} catch (error) {
  console.error('Failed to render React app:', error);
  
  // Fallback рендер в случае критической ошибки
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h2>Произошла ошибка при загрузке приложения</h2>
      <p>Пожалуйста, обновите страницу</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; font-size: 16px;">
        Обновить
      </button>
    </div>
  `;
}
