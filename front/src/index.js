import ReactDOM from 'react-dom';

// import Navabar from './components/Navbar';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom'



ReactDOM.render( <BrowserRouter><App /> </BrowserRouter> , document.getElementById('root'));
