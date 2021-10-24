import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./store"
import {fetchEmojis} from "./reducers/emojis";
import {fetchUsers} from "./reducers/users";
import {fetchGames} from "./reducers/games";

store.dispatch(fetchUsers())
store.dispatch(fetchGames())
store.dispatch(fetchEmojis())

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <App/>
        </Provider>
    </Router>,
    document.getElementById('root'));
