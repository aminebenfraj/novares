import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client.js';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/index.css'
import './styles/App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
