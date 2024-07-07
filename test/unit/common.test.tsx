import React from 'react';
import { Provider } from 'react-redux';
import { Application } from '../../src/client/Application';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartApi, ExampleApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';

describe('Верстка должна адаптироваться под ширину экрана', () => {
  
  function resizeWindow(width: number, height: number) {
    window.innerWidth = width;
    window.innerHeight = height;
    window.dispatchEvent(new Event('resize'));
  }

  it('При ширине экрана <1024px нет горизонтального скролла', () => {

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

    resizeWindow(768, 768);

    expect(document.body.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  })

  it('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', () => {
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
    
    const { container } = render(application);

    resizeWindow(530, 768);

    const menuButton = screen.getByRole('button', { name: /toggle navigation/i });

    expect(menuButton).toBeVisible();

    const linksContainer = container.querySelector('.Application-Menu')

    expect(linksContainer?.classList.contains('collapse')).toBe(true);
  });
  
  it('должен закрывать меню при выборе элемента из меню "гамбургера"', () => {
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
    
    const { container } = render(application);

    resizeWindow(375, 667);

    const menuButton = screen.getByRole('button', { name: /toggle navigation/i })

    fireEvent.click(menuButton);

    const linksContainer = container.querySelector('.Application-Menu')
    const catalogLink = screen.getByRole('link', { name: /catalog/i});

    expect(linksContainer?.classList.contains('collapse')).toBe(false);

    fireEvent.click(catalogLink);

    expect(linksContainer?.classList.contains('collapse')).toBe(true);
  });

});

describe('Шапка страницы', () => {
  it('В шапке отображаются ссылки на страницы магазина', () => {
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
    
      const expectedLinks = [
        { name: 'Kogtetochka store', href: '/' },
        { name: 'Catalog', href: '/catalog' },
        { name: 'Delivery', href: '/delivery' },
        { name: 'Contacts', href: '/contacts' },
        { name: 'Cart', href: '/cart' },
      ];
    
      const linkElements = screen.getAllByRole('link');
    
      const actualLinks = linkElements.map(link => ({
        name: link.textContent,
        href: link.getAttribute('href'),
      }));
    
      expect(actualLinks).toEqual(expectedLinks);
    });
});