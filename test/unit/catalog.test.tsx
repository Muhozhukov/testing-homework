import axios from "axios";
import React, { act } from 'react';
import { Provider } from 'react-redux';
import { Application } from '../../src/client/Application';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartApi, ExampleApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { faker } from "@faker-js/faker";
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';
import { CartState, Product as ProductType, ProductShortInfo } from "../../src/common/types";
import { Catalog } from "../../src/client/pages/Catalog";
import { ProductItem } from "../../src/client/components/ProductItem";
import { Product } from "../../src/client/pages/Product";
import { ProductDetails } from "../../src/client/components/ProductDetails";

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

const cart: CartState = {
    1: { ...response.data[0], count: 1 },
}

describe('Каталог', () => {
    beforeAll(() => {
        jest.spyOn(axios, 'get').mockResolvedValue(response);
    })
    afterAll(() => {
        jest.clearAllMocks();
    })
    it('в каталоге должны отображаться товары, список которых приходит с сервера', async () => {
        const basename = '/';

        const api = new ExampleApi(basename);
        const cartt = new CartApi();
        const store = initStore(api, cartt);
    
        const application = (
            <MemoryRouter initialEntries={['/catalog']}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        )
        
        const { container } = render(application)

        await waitFor(() => {
            expect(container.querySelectorAll('.ProductItem')).toHaveLength(ReceivedProductCnt);
        })
    })
    
    it('для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async () => {
        const product = response.data[0]
        const basename = '/';

        const api = new ExampleApi(basename);
        const cartt = new CartApi();
        const store = initStore(api, cartt);
    
        const application = (
            <MemoryRouter>
                <Provider store={store}>
                    <ProductItem product={product} />
                </Provider>
            </MemoryRouter>
        )
        
        const { getByText, getByRole } = render(application)

        const name = getByText(product.name);
        const price = getByText(`$${product.price}`);
        const link = getByRole('link');
        await waitFor(() => {
            expect(name).toBeInTheDocument();
            expect(price).toBeInTheDocument();
            expect(link).toHaveAttribute('href', `/catalog/${product.id}`);
        })
    })

    it('если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом', async () => {
        jest.spyOn(CartApi.prototype, 'getState').mockReturnValue(cart);
        
        const basename = '/';
        
        const api = new ExampleApi(basename);
        const cartt = new CartApi();
        const store = initStore(api, cartt);
    
        const application = (
            <MemoryRouter>
                <Provider store={store}>
                    <Catalog />
                </Provider>
            </MemoryRouter>
        )
        
        const { container } = render(application)

        await waitFor(() => {
            expect(container.querySelector('.ProductItem .CartBadge')).toBeInTheDocument();
        })
    })
    it('если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async () => {
        jest.spyOn(CartApi.prototype, 'getState').mockReturnValue({});
        const mockProduct: {data: ProductType} = {
            data: {
                id: 1,
                name: faker.commerce.productName(),
                price: +faker.commerce.price(),
                description: '', material: '', color: ''
            }
                
        };
        
        const basename = '/';
        
        const api = new ExampleApi(basename);
        const cartt = new CartApi();
        const store = initStore(api, cartt);
    
        const application = (
            <MemoryRouter>
                <Provider store={store}>
                    <ProductDetails product={mockProduct.data} />
                </Provider>
            </MemoryRouter>
        )
        
        const { container } = render(application)

        screen.logTestingPlaygroundURL()
        await waitFor(() => {
            expect(container.querySelector('.ProductDetails-Name')).toBeInTheDocument();
        })
        const button = container.querySelector('.ProductDetails-AddToCart');

        act(() => {
            fireEvent.click(button!);
            fireEvent.click(button!);
            fireEvent.click(button!);
        })

        const finalState = store.getState();
        console.log(finalState)

        expect(finalState.cart[1].count).toBe(3);
    })
})