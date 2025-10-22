import "./App.css";
import { Dashboard } from "./components/Dashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Dashboard />
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
