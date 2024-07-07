import React from 'react';
import { Provider } from 'react-redux';
import { Application } from '../../src/client/Application';
import { render, screen } from '@testing-library/react';
import { CartApi, ExampleApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';

describe('Simple Test Case', () => {
    it('Should render', () => {
        const app = <div>example</div>;

        const { container } = render(app);

        // console.log(container.outerHTML);

        expect(container.textContent).toBe('example');
    });
});
