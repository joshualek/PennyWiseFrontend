import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
	test('renders Dashboard with user data', () => {
		const mockData = {
			userName: 'John Doe',
			budgets: [],
			expenses: [],
			income: []
		};

		render(<Dashboard {...mockData} />);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
	});

	test('toggles sidebar visibility', () => {
		const mockData = {
			userName: 'John Doe',
			budgets: [],
			expenses: [],
			income: []
		};

		render(<Dashboard {...mockData} />);

		const toggleButton = screen.getByRole('button', { name: /menuicon/i });
		fireEvent.click(toggleButton);

		// Assuming the sidebar has a role or text to identify its visibility
		expect(screen.getByRole('complementary')).toHaveClass('dashboard-expanded');
	});
});

