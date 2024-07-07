import React from 'react';
import { Provider } from 'react-redux';
import { Application } from '../../src/client/Application';
import { render, screen } from '@testing-library/react';
import { CartApi, ExampleApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';

describe('Наличие страниц и их содержимого', () => {

    it('В магазине должна быть страница "Главная"', () => {
        const basename = '/';

        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);
    
        const application = (
            <MemoryRouter>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        )
        
        const { container } = render(application)
    
        const title = screen.getByText(/welcome to kogtetochka store!/i)
        expect(title).toBeInTheDocument();
    })

    it('В магазине должна быть страница "Каталог"', () => {
        const basename = '/';

        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);
    
        const application = (
            <MemoryRouter initialEntries={['/catalog']}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        )
        
        const { container } = render(application)

        const title = screen.getByRole('heading');

        expect(title).toHaveTextContent('Catalog');
    })

    it('В магазине должна быть страница "Доставка"', () => {
        const basename = '/';

        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);
    
        const application = (
            <MemoryRouter initialEntries={['/delivery']}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        )
        
        const { container } = render(application)

        const title = screen.getByRole('heading');

        expect(title).toHaveTextContent('Delivery');
    })

    it('В магазине должна быть страница "Контакты"', () => {
        const basename = '/';

        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);
    
        const application = (
            <MemoryRouter initialEntries={['/contacts']}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        )
        
        const { container } = render(application)

        const title = screen.getByRole('heading');

        expect(title).toHaveTextContent('Contacts');
    })
});