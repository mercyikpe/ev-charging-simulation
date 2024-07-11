import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'

import SimulationResults from '@/components/SimulationResults';

describe('SimulationResults Component', () => {
  const mockProps = {
    totalEnergy: 10000,
    theoreticalMaxDemand: 220,
    actualMaxDemand: 120,
    concurrencyFactor: 0.54545,
  };

  test('renders simulation results with correct values', () => {
    const { getByText } = render(<SimulationResults {...mockProps} />);
    
    expect(getByText('Simulation Results')).toBeInTheDocument();
    expect(getByText('Total energy consumed')).toBeInTheDocument();
    expect(getByText('Theoretical maximum power demand')).toBeInTheDocument();
    expect(getByText('Actual maximum power demand')).toBeInTheDocument();
    expect(getByText('Concurrency factor')).toBeInTheDocument();

    expect(getByText('10000.00 kWh')).toBeInTheDocument();
    expect(getByText('220.00 kW')).toBeInTheDocument();
    expect(getByText('120.00 kW')).toBeInTheDocument();
    expect(getByText('54.55%')).toBeInTheDocument();
  });
});
