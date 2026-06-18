import { AuthProvider } from './AuthProvider';

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
