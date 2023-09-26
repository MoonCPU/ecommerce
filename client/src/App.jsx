import './App.css';
import { BrowserRouter } from 'react-router-dom';
import PageRoutes from './components/PageRoutes';
import Navbar from './components/Navbar';
import { AuthProvider } from './components/AuthProvider';

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <div className='h-screen'>
            <Navbar />
            <PageRoutes />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App