import './App.css'
import { BrowserRouter } from "react-router-dom";
import PageRoutes from './components/PageRoutes';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {

  return (
    <div>
      <BrowserRouter>
      <Navbar />
      <PageRoutes />    
      <Footer />
      </BrowserRouter>      
    </div>

  )
}

export default App