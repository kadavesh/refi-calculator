# Mortgage Refinance Savings Calculator

A user-friendly and interactive application that calculates the monthly savings from a mortgage refinance.

## Features

- Calculate monthly savings from refinancing your mortgage
- Calculate total savings over the life of the mortgage (30 years)
- Option to roll closing costs into the new mortgage
- Real-time calculation updates as you change inputs
- Clean, modern UI with responsive design

## Inputs

The calculator takes the following inputs:

### Current Mortgage
- Current mortgage balance
- Current mortgage rate
- Origination year of the current mortgage

### New Mortgage
- New mortgage balance
- New mortgage rate  
- Origination year of the new mortgage
- Closing costs
- Option to roll closing costs into the new mortgage

## Outputs

- Monthly savings in dollars
- Total savings over the life of the mortgage (30 years)
- Warning if the refinance is not financially beneficial

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/refi-calculator.git
   cd refi-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How the Calculator Works

The calculator uses the standard amortization formula to calculate monthly payments:

Monthly Payment = (P * r * (1 + r)^n) / ((1 + r)^n - 1)

Where:
- P = Principal (loan amount)
- r = Monthly interest rate (annual rate / 12 / 100)
- n = Total number of payments (years * 12)

For total savings, the calculator:
1. Computes the difference in monthly payments
2. Accounts for the remaining term of the current mortgage
3. Factors in closing costs (either as upfront cost or rolled into the loan)
4. Accounts for additional payments if the new mortgage extends beyond when the current one would be paid off

## Built With

- [React](https://reactjs.org/) - Frontend library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [React Bootstrap](https://react-bootstrap.github.io/) - Bootstrap components

## License

This project is licensed under the MIT License - see the LICENSE file for details.
