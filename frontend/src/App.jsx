import { Routes, Route } from 'react-router-dom';
import Showpd from './pages/productDesignation/productDesignation-form';
import Createpd from './pages/productDesignation/productDesignation-table';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AuthProvider } from './context/AuthContext';
import MassProductionForm from './pages/MassProductionForm/MassProductionForm';
import MassProductionTable from './pages/MassProductionForm/MassProductionList'
import CustomerList from './pages/customer/CustomerList';
import CreateCustomer from './pages/customer/CustomerForm';
import EditCustomer from './pages/customer/EditCustomer';
import { Home } from './pages/homepage/Home';
import  Test  from './pages/D01/Test';
import  Test1  from './pages/D01/Test1';
import  Test2  from './pages/D01/Test2';
import  Test3  from './pages/D01/Test3';
import  Test4  from './pages/D01/Test4';

function App() {
  return (
      <AuthProvider>
    <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/pd" element={<Showpd />} />
          <Route path="/pd/create" element={<Createpd />} />
          <Route path="/masspd/create" element={<MassProductionForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/create" element={<CreateCustomer />} />
          <Route path="/customers/edit/:id" element={<EditCustomer />} />
          <Route path="/masspd" element={<MassProductionTable />} />
          <Route path="/test" element={<Test />} />
          <Route path="/test1" element={<Test1 />} />
          <Route path="/test2" element={<Test2 />} />
          <Route path="/test3" element={<Test3 />} />
          <Route path="/test4" element={<Test4 />} />
    </Routes>
      </AuthProvider>
  );
}

export default App;
