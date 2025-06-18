import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './ui/Home';
import Menu, { loader as menuLoader } from './features/menu/Menu';
import Cart from './features/cart/Cart';
import CreateOrder, {
  action as orderAction,
} from './features/order/CreateOrder';
import Order, { loader as orderLoader } from './features/order/Order';
import Applayout from './ui/Applayout';
import Error from './ui/Error';
import ProtectedRoute from './features/authentication/ProtectedRoute';
import { action as updateAction } from './features/order/UpdateOrder';

const router = createBrowserRouter([
  {
    element: <Applayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/menu',
        element: (
          // <ProtectedRoute>
          <Menu />
          // </ProtectedRoute>
        ),
        loader: menuLoader,
        errorElement: <Error />,
      },
      {
        path: '/cart',
        element: (
          // <ProtectedRoute>
          <Cart />
          // </ProtectedRoute>
        ),
      },
      {
        path: '/order/new',
        element: (
          // <ProtectedRoute>
          <CreateOrder />
          // </ProtectedRoute>
        ),
        action: orderAction,
      },
      {
        path: '/order/:id',
        element: (
          // <ProtectedRoute>
          <Order />
          // </ProtectedRoute>
        ),
        action: updateAction,
        loader: orderLoader,
        errorElement: <Error />,
      },
    ],
  },
]);
export default function App() {
  console.log(window.isSecureContext);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
