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
          <Navbar />
          <div className='sm:mt-10 lg:mt-18'>
            <PageRoutes />              
          </div>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App