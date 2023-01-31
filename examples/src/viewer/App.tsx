import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ExampleList from './ExampleList.js';

const App: React.FC = () => {
  return (
    <Router>
      <ExampleList />
    </Router>
  );
};

export default App;
