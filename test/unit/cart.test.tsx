import axios from "axios";
import React from 'react';
import { Provider } from 'react-redux';
import { Application } from '../../src/client/Application';
import { render, waitFor } from '@testing-library/react';
import { CartApi, ExampleApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { faker } from "@faker-js/faker";
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';
import { CartState, ProductShortInfo } from "../../src/common/types";
import { Cart } from "../../src/client/pages/Cart";

const ReceivedProductCnt = 5;

const response: {data: ProductShortInfo[]} = {
    data: Array.from({length: ReceivedProductCnt}, (_, i) => {
        return {
            id: i + 1,
            name: faker.commerce.productName(),
            price: +faker.commerce.price()
        }
    })
}

const mockCart: CartState = {
    1: { ...response.data[0], count: 1 },
    2: { ...response.data[1], count: 1 },
}

describe('Корзина', () => {
    it('в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(response);
        jest.spyOn(CartApi.prototype, 'getState').mockReturnValue(mockCart);

        const basename = '/';

        const api = new ExampleApi(basename);
        const cartApi = new CartApi();
        const store = initStore(api, cartApi);
    
        const application = (
            <MemoryRouter initialEntries={['/catalog']}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        )
        
        const { getAllByRole} = render(application)

        await waitFor(() => {
            const cartLink = getAllByRole('link').filter(link => link.getAttribute('href') === '/cart')
            expect(cartLink[0].textContent).toBe('Cart (2)');
        })

        jest.clearAllMocks();
    })
    
    it('в корзине должна отображаться таблица с добавленными в нее товарами', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(response);
        const basename = '/';

        const api = new ExampleApi(basename);
        const cartApi = new CartApi();
        const store = initStore(api, cartApi);
    
        const application = (
            <MemoryRouter>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </MemoryRouter>
        )
        
        const { container } = render(application)

        await waitFor(() => {
            expect(container.querySelector('.Cart-Table')).toBeInTheDocument();
        })
        jest.clearAllMocks();
    })

    it('для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(response);
        const product1 = response.data[0];
        const product2 = response.data[1];

        const basename = '/';
        
        const api = new ExampleApi(basename);
        const cartApi = new CartApi();
        const store = initStore(api, cartApi);
    
        const application = (
            <MemoryRouter>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </MemoryRouter>
        )
        
        const { container } = render(application)

        const productNames = container.querySelectorAll('.Cart-Name');
        const totalPrice = container.querySelector('.Cart-OrderPrice');
        
        expect(productNames[0].textContent).toBe(product1.name);
        expect(productNames[1].textContent).toBe(product2.name);
        expect(+totalPrice!.textContent!.slice(1)).toBe(product1.price + product2.price);
        jest.clearAllMocks();
    })

    it('если корзина пустая, должна отображаться ссылка на каталог товаров', async () => {
        jest.spyOn(CartApi.prototype, 'getState').mockReturnValue({});

        const basename = '/';
        
        const api = new ExampleApi(basename);
        const cartApi = new CartApi();
        const store = initStore(api, cartApi);
    
        const application = (
            <MemoryRouter>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </MemoryRouter>
        )
        
        const { container } = render(application)

        expect(container.querySelector('.Cart-Table')).not.toBeInTheDocument();
        expect(container.querySelector('.Cart a')).toBeInTheDocument();
        jest.clearAllMocks();
    })
})