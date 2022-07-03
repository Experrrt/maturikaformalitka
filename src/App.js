import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import PagePriklady from './komponenty/PagePriklady';
import Header from './komponenty/Header';
import Test from './komponenty/test';
import './css/app.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <PagePriklady />
        <Test />
      </div>
    </Router>
  );
}

export default App;
