// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from './store.jsx';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from './resources.jsx';

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: "ru",
    fallbackLng: "ru",
  });

createRoot(document.getElementById('root')).render(
  <Provider store={store}> 
    <App />
  </Provider>
)
