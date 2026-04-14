import { AppProviders, AppRouterProvider } from './app';
import { ToastContainer } from 'react-toastify';

export default function App() {
  //* States

  //* Custom hooks

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  return (
    <AppProviders>
      <AppRouterProvider />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </AppProviders>
  );
}
