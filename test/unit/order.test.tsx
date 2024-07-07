import axios from "axios";
import React from 'react';
import { Provider } from 'react-redux';
import { userEvent } from '@testing-library/user-event';
import { render, waitFor } from '@testing-library/react';
import { CartApi, ExampleApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { Faker, ru } from "@faker-js/faker";
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';
import { CartState, CheckoutResponse, ProductShortInfo } from "../../src/common/types";
import { Cart } from "../../src/client/pages/Cart";

const mockCart: CartState = {
    1: { name: '1', count: 1, price: 10 },
    2: { name: '2', count: 1, price: 20 },
    3: { name: '3', count: 1, price: 30 },
}

const checkoutResponse: {data: CheckoutResponse} = {
    data: {
        id: 1,
    }
} 

const faker = new Faker({
    locale: [ru]
})

describe('Оформление заказа', () => {

    beforeAll(() => {
        jest.spyOn(CartApi.prototype, 'getState').mockReturnValue(mockCart);
        jest.spyOn(axios, 'post').mockResolvedValue(checkoutResponse);
    })
    afterEach(() => {
        jest.clearAllMocks();
    })
    it('Отображается при наличии товара в корзине', async () => {
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
        
        const { container } = render(application);

        await waitFor(() => {
            expect(container.querySelector('.Form')).toBeInTheDocument();
        })
    })
    it('при заполнении формы появляется сообщение об успешной отправке и ссылка на каталог товаров', async () => {
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
        
        const { container, findByText } = render(application);

        const inputName = await waitFor(() => container.querySelector('#f-name'));
        await userEvent.type(inputName!, faker.person.fullName());

        const inputPhone = await waitFor(() => container.querySelector('#f-phone'));
        await userEvent.type(inputPhone!, '89999999999');

        const inputAddress = await waitFor(() => container.querySelector('#f-address'));
        await userEvent.type(inputAddress!, faker.location.streetAddress());

        const submitBtn = await waitFor(() => container.querySelector('.Form-Submit'));
        await userEvent.click(submitBtn!);
        waitFor(async () => {
            expect(container.querySelector('.Cart-SuccessMessage')).toBeInTheDocument();
            expect(await findByText('catalog')).toHaveAttribute('href', '/catalog');

        });
        
    })
    it('при невалидном значении имени появляется ошибка', async () => {

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
        
        const { findByText } = render(application);

        const submitBtn = await findByText('Checkout');
        await userEvent.click(submitBtn);
        const error = await findByText('Please provide your name');

        expect(error).toBeInTheDocument();
    })
    it('В случае невалидного ввода телефона появляется ошибка', async () => {

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
        
        const { findByText, container } = render(application);

        const inputPhone = await waitFor(() => container.querySelector('input#f-phone'));
        await userEvent.type(inputPhone!, '123');
        const submitBtn = await findByText('Checkout');
        await userEvent.click(submitBtn);
        const error = await findByText('Please provide a valid phone');

        expect(error).toBeInTheDocument();
    })
    it('В случае невалидного ввода адреса появляется ошибка', async () => {

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
        
        const { findByText } = render(application);

        const submitBtn = await findByText('Checkout');
        await userEvent.click(submitBtn);
        const error = await findByText('Please provide a valid address');
        expect(error).toBeInTheDocument();
    })
})