import React, {Component} from 'react';
import Layout from "./Layout";
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
            alert('Please, use https version of site!');
        }
    }

    render() {
        return (
            <Layout/>
        );
    }
}

export default App;
