import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//Generowanie strony z podanymi komponentami
ReactDOM.render(
    <App />,
  document.getElementById('root')
);

//Funcja do analizy wydajności strony
//Aktualnie nie używana
reportWebVitals();
