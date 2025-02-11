import { Routes, Route } from 'react-router-dom';
import Showpd from './pages/productDesignation/productDesignation-form';
import Createpd from './pages/productDesignation/productDesignation-table';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AuthProvider } from './context/AuthContext';
import MassProductionForm from './pages/MassProductionForm/MassProductionForm';
import CustomerList from './pages/customer/CustomerList';
import CreateCustomer from './pages/customer/CustomerForm';
import EditCustomer from './pages/customer/EditCustomer';

function App() {
  return (
      <AuthProvider>
    <Routes>
      <Route path="/pd" element={<Showpd />} />
      <Route path="/pd/create" element={< Createpd/>} />
      <Route path="/masspd" element={< MassProductionForm/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/create" element={<CreateCustomer />} />
        <Route path="/customers/edit/:id" element={<EditCustomer />} />
    </Routes>
      </AuthProvider>
  );
}

export default App;
