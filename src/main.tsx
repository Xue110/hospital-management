import ReactDOM from 'react-dom/client';
import './index.scss';
import router from './router';
import { RouterProvider } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
