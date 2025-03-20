import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#363636',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '16px',
        },
        success: {
          iconTheme: {
            primary: '#4CAF50',
            secondary: '#FFFFFF',
          },
        },
        error: {
          iconTheme: {
            primary: '#E53935',
            secondary: '#FFFFFF',
          },
          style: {
            border: '1px solid #FFCCBC',
          },
        },
      }}
    />
  );
} 