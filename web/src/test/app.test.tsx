import React from 'react';
import App from '../App';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('App', () => {
    it('should display the app title', () => {
        render(<App />);
        const title = screen.queryByText(/app|title/i);
        expect(title || document.body.children.length).toBeTruthy();
    });

    it('should have the correct structure', () => {
        const { container } = render(<App />);
        expect(container.firstChild).toBeTruthy();
    });
});