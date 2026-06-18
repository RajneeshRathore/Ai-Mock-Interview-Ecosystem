import { AppRouter } from './app/routes';
import { AppProvider } from './app/providers/AppProvider';

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
