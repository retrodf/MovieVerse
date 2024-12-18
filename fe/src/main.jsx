import { StrictMode } from 'react';
import React from "react";
import ReactDOM from "react-dom";  // Menggunakan react-dom untuk React 17
import App from './App.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import './dist/css/main.css';

import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>
);
