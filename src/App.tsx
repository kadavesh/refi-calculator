import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MortgageRefinanceCalculator from './components/MortgageRefinanceCalculator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mortgage Refinance Calculator</h1>
      </header>
      <main>
        <MortgageRefinanceCalculator />
      </main>
      <footer className="mt-5 text-center">
        <p>© {new Date().getFullYear()} Mortgage Refinance Calculator</p>
      </footer>
    </div>
  );
}

export default App;
