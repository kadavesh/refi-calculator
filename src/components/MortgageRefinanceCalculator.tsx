import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Form, Row, Col, Container } from 'react-bootstrap';

interface CurrentMortgage {
  originalAmount: number;
  rate: number;
  originationYear: number;
  term: number; // Term in years
}

interface NewMortgage {
  currentBalance: number;
  rate: number;
  originationYear: number;
  closingCosts: number;
  cashInAmount: number;
  term: number; // Term in years
}

const MortgageRefinanceCalculator: React.FC = () => {
  // Current mortgage state
  const [currentMortgage, setCurrentMortgage] = useState<CurrentMortgage>({
    originalAmount: 1575000,
    rate: 5.875,
    originationYear: 2023,
    term: 30,
  });

  // New mortgage state
  const [newMortgage, setNewMortgage] = useState<NewMortgage>({
    currentBalance: 1543107.76,
    rate: 5.375,
    originationYear: new Date().getFullYear(),
    closingCosts: 6666,
    cashInAmount: 0,
    term: 30,
  });

  // Loan term options
  const loanTermOptions = [10, 15, 20, 30];

  // UI state
  const [rollClosingCosts, setRollClosingCosts] = useState<boolean>(false);
  const [results, setResults] = useState<{
    currentMonthlyPayment: number;
    newMonthlyPayment: number;
    monthlySavings: number;
    totalSavings: number;
    currentRemainingTermYears: number;
  } | null>(null);

  // Calculate monthly payment for a mortgage
  const calculateMonthlyPayment = (
    principal: number,
    annualRate: number,
    termInYears: number = 30
  ): number => {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = termInYears * 12;

    // Handle edge case for zero interest rate
    if (monthlyRate === 0) return principal / numberOfPayments;

    const x = Math.pow(1 + monthlyRate, numberOfPayments);
    return (principal * monthlyRate * x) / (x - 1);
  };

  // Calculate remaining term in years for the current mortgage
  const calculateRemainingTerm = (originationYear: number, originalTerm: number): number => {
    const currentYear = new Date().getFullYear();
    const yearsPassed = currentYear - originationYear;
    return Math.max(originalTerm - yearsPassed, 1); // Ensure at least 1 year remains
  };

  // Calculate savings between current and new mortgage
  const calculateSavings = useCallback(() => {
    // Convert any empty string values to zero for calculations
    const currentMortgageCalc = {
      ...currentMortgage,
      originalAmount: typeof currentMortgage.originalAmount === 'string' ? 0 : currentMortgage.originalAmount,
      rate: typeof currentMortgage.rate === 'string' ? 0 : currentMortgage.rate,
      originationYear: typeof currentMortgage.originationYear === 'string' ? new Date().getFullYear() - 5 : currentMortgage.originationYear,
      term: typeof currentMortgage.term === 'string' ? 30 : currentMortgage.term
    };

    const newMortgageCalc = {
      ...newMortgage,
      currentBalance: typeof newMortgage.currentBalance === 'string' ? 0 : newMortgage.currentBalance,
      rate: typeof newMortgage.rate === 'string' ? 0 : newMortgage.rate,
      originationYear: typeof newMortgage.originationYear === 'string' ? new Date().getFullYear() : newMortgage.originationYear,
      closingCosts: typeof newMortgage.closingCosts === 'string' ? 0 : newMortgage.closingCosts,
      cashInAmount: typeof newMortgage.cashInAmount === 'string' ? 0 : newMortgage.cashInAmount,
      term: typeof newMortgage.term === 'string' ? 30 : newMortgage.term
    };

    // Calculate remaining principal term for current mortgage
    const currentRemainingTermYears = calculateRemainingTerm(
      currentMortgageCalc.originationYear,
      currentMortgageCalc.term
    );
    
    // IMPORTANT FIX: Calculate the current monthly payment based on the ORIGINAL mortgage structure
    // but with the current balance
    const currentMonthlyPayment = calculateMonthlyPayment(
      currentMortgageCalc.originalAmount,
      currentMortgageCalc.rate,
      currentMortgageCalc.term
    );
    
    // Adjust new mortgage balance based on cash-in amount and closing costs
    const effectiveBalance = newMortgageCalc.currentBalance - newMortgageCalc.cashInAmount;
    const newPrincipal = rollClosingCosts 
      ? effectiveBalance + newMortgageCalc.closingCosts
      : effectiveBalance;
    
    // Calculate monthly payment for the new mortgage using the selected term
    const newMonthlyPayment = calculateMonthlyPayment(
      newPrincipal,
      newMortgageCalc.rate,
      newMortgageCalc.term
    );
    
    // Calculate monthly savings - the difference between current and new payments
    const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
    
    // For debugging - log the values
    console.log({
      originalAmount: currentMortgageCalc.originalAmount,
      originalRate: currentMortgageCalc.rate,
      originalTerm: currentMortgageCalc.term,
      currentMonthlyPayment,
      
      newBalance: newMortgageCalc.currentBalance,
      effectiveBalance,
      rollClosingCosts,
      closingCosts: newMortgageCalc.closingCosts,
      newPrincipal,
      newRate: newMortgageCalc.rate,
      newTerm: newMortgageCalc.term,
      newMonthlyPayment,
      
      monthlySavings
    });
    
    // Calculate total cost of continuing with current mortgage for its remaining term
    const remainingPaymentsCurrentMortgage = currentRemainingTermYears * 12;
    const currentMortgageFuturePayments = currentMonthlyPayment * remainingPaymentsCurrentMortgage;
    
    // Calculate total cost of new mortgage over its selected term
    const totalPaymentsNewMortgage = newMortgageCalc.term * 12;
    const newMortgageTotalPayments = newMonthlyPayment * totalPaymentsNewMortgage;
    
    // Total costs comparison
    let totalSavings = 0;
    
    // Fixed calculation approach - Compare what they would pay in total for each option
    if (currentRemainingTermYears < newMortgageCalc.term) {
      // Remaining term on current mortgage is less than the new mortgage term
      const currentTotalCost = currentMortgageFuturePayments;
      const newTotalCost = newMortgageTotalPayments;
      totalSavings = currentTotalCost - newTotalCost;
    } else {
      // Compare the same period for both (length of new mortgage term)
      totalSavings = monthlySavings * totalPaymentsNewMortgage;
    }
    
    // Subtract closing costs if not rolled into the new mortgage
    if (!rollClosingCosts) {
      totalSavings -= newMortgageCalc.closingCosts;
    }
    
    // Subtract cash-in amount from total savings
    totalSavings -= newMortgageCalc.cashInAmount;
    
    setResults({
      currentMonthlyPayment,
      newMonthlyPayment,
      monthlySavings,
      totalSavings,
      currentRemainingTermYears,
    });
  }, [currentMortgage, newMortgage, rollClosingCosts]);

  // Recalculate when inputs change
  useEffect(() => {
    calculateSavings();
  }, [calculateSavings]);

  // Handle form changes for current mortgage
  const handleCurrentMortgageChange = (e: ChangeEvent<HTMLElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setCurrentMortgage(prev => ({
      ...prev,
      [name]: name === 'originationYear' || name === 'term'
        ? value === '' ? '' : parseInt(value, 10) || 0
        : value === '' ? '' : parseFloat(value) || 0
    }));
  };

  // Handle form changes for new mortgage
  const handleNewMortgageChange = (e: ChangeEvent<HTMLElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setNewMortgage(prev => ({
      ...prev,
      [name]: name === 'originationYear' || name === 'term'
        ? value === '' ? '' : parseInt(value, 10) || 0
        : value === '' ? '' : parseFloat(value) || 0
    }));
  };

  // Handle checkbox change for rolling closing costs
  const handleRollClosingCostsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRollClosingCosts(e.target.checked);
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col md={4} className="mb-4">
          <div className="form-container">
            <div className="box-title">
              <h2 className="h4 mb-0 text-center">Current Mortgage</h2>
            </div>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Original Mortgage Amount ($)</Form.Label>
                <Form.Control
                  type="number"
                  name="originalAmount"
                  value={currentMortgage.originalAmount}
                  onChange={handleCurrentMortgageChange}
                  min="0"
                  step="1000"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Original Interest Rate (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="rate"
                  value={currentMortgage.rate}
                  onChange={handleCurrentMortgageChange}
                  min="0"
                  step="0.125"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Origination Year</Form.Label>
                <Form.Control
                  type="number"
                  name="originationYear"
                  value={currentMortgage.originationYear}
                  onChange={handleCurrentMortgageChange}
                  min="1980"
                  max={new Date().getFullYear()}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Loan Term (years)</Form.Label>
                <Form.Select
                  name="term"
                  value={currentMortgage.term}
                  onChange={handleCurrentMortgageChange}
                >
                  {loanTermOptions.map(term => (
                    <option key={`current-${term}`} value={term}>{term} years</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </div>
        </Col>

        <Col md={4} className="mb-4">
          <div className="form-container">
            <div className="box-title">
              <h2 className="h4 mb-0 text-center">New Mortgage</h2>
            </div>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Current Mortgage Balance ($)</Form.Label>
                <Form.Control
                  type="number"
                  name="currentBalance"
                  value={newMortgage.currentBalance}
                  onChange={handleNewMortgageChange}
                  min="0"
                  step="1000"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cash-In Amount ($)</Form.Label>
                <Form.Control
                  type="number"
                  name="cashInAmount"
                  value={newMortgage.cashInAmount}
                  onChange={handleNewMortgageChange}
                  min="0"
                  max={newMortgage.currentBalance}
                  step="1000"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>New Interest Rate (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="rate"
                  value={newMortgage.rate}
                  onChange={handleNewMortgageChange}
                  min="0"
                  step="0.125"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Loan Term (years)</Form.Label>
                <Form.Select
                  name="term"
                  value={newMortgage.term}
                  onChange={handleNewMortgageChange}
                >
                  {loanTermOptions.map(term => (
                    <option key={`new-${term}`} value={term}>{term} years</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Origination Year</Form.Label>
                <Form.Control
                  type="number"
                  name="originationYear"
                  value={newMortgage.originationYear}
                  onChange={handleNewMortgageChange}
                  min="1980"
                  max={new Date().getFullYear() + 1}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Closing Costs ($)</Form.Label>
                <Form.Control
                  type="number"
                  name="closingCosts"
                  value={newMortgage.closingCosts}
                  onChange={handleNewMortgageChange}
                  min="0"
                  step="100"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Roll closing costs into new mortgage"
                  checked={rollClosingCosts}
                  onChange={handleRollClosingCostsChange}
                />
              </Form.Group>
            </Form>
          </div>
        </Col>
        
        <Col md={4} className="mb-4">
          <div className="results-container d-flex flex-column">
            <div className="box-title">
              <h2 className="h4 mb-0 text-center">Refinance Savings</h2>
            </div>
            
            {results && (
              <>
                <div className="mb-3">
                  <div className="fw-bold mb-1">Current Monthly Payment:</div>
                  <div className="fs-5">
                    ${results.currentMonthlyPayment.toFixed(2)}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="fw-bold mb-1">New Monthly Payment:</div>
                  <div className="fs-5">
                    ${results.newMonthlyPayment.toFixed(2)}
                    <span className="small text-muted ms-2">({newMortgage.term} year term)</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="fw-bold mb-1">Monthly Savings:</div>
                  <div className="fs-5">
                    <span className={results.monthlySavings >= 0 ? "savings-highlight" : "text-danger fw-bold"}>
                      ${results.monthlySavings.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="fw-bold mb-1">Current Mortgage Remaining:</div>
                  <div className="fs-5">
                    {results.currentRemainingTermYears.toFixed(1)} years
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="fw-bold mb-1">Total Lifetime Savings:</div>
                  <div className="fs-5">
                    <span className={results.totalSavings >= 0 ? "total-savings" : "text-danger fw-bold"}>
                      ${results.totalSavings.toFixed(2)}
                    </span>
                    <div className="small text-muted mt-1">
                      Comparing your current remaining term to a new {newMortgage.term}-year mortgage
                    </div>
                  </div>
                </div>
                
                {results.totalSavings < 0 && (
                  <div className="alert alert-warning mt-3">
                    This refinance may not be financially beneficial in the long term.
                  </div>
                )}
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MortgageRefinanceCalculator; 