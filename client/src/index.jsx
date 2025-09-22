import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./store"

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Router>
        <Provider store={store}>
            <App/>
        </Provider>
    </Router>
);
