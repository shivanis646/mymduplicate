import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import "leaflet/dist/leaflet.css";


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/Map-My-Memoir/">
    <App />
  </BrowserRouter>
);
