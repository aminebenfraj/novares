import { Routes, Route } from 'react-router-dom';
import ProductForm from './pages/productDesignation-form';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
      <AuthProvider>
    <Routes>
      <Route path="/form" element={<ProductForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
      </AuthProvider>
  );
}

export default App;
