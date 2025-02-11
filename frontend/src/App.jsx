import { Routes, Route } from 'react-router-dom';
import ProductForm from './pages/productDesignation-form';

function App() {
  return (
    <Routes>
      <Route path="/form" element={<ProductForm />} />
    </Routes>
  );
}

export default App;
