import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/CartSlice';
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import { formatCurrency } from '../../utils/helpers';
import { useEffect, useState } from 'react';
import { fetchAddress, reset } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const formErrors = useActionData();
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: addressError,
  } = useSelector((state) => state.user);
  const isLoadingStatus = addressStatus === 'loading';
  const priceTotal = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? priceTotal * 0.2 : 0;
  const totalPrice = priceTotal + priorityPrice;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  console.log(cart);
  if (!cart.length) return <EmptyCart />;
  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Lets go!</h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            type="text"
            name="customer"
            defaultValue={username}
            required
          />
        </div>

        <div
          className={`mb-5 flex flex-col gap-2 sm:flex-row ${!formErrors?.phone && 'sm:items-center'}`}
        >
          <label
            className={`sm:basis-40 ${formErrors?.phone && 'py-0 sm:py-2.5'}`}
          >
            Phone number
          </label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div
          className={`mb-5 flex flex-col gap-2 sm:flex-row ${!addressStatus === 'error' && 'sm:items-center'}`}
        >
          <label
            className={`sm:basis-40 ${addressStatus === 'error' && 'py-0 sm:py-2.5'}`}
          >
            Address
          </label>
          <div className="relative flex grow flex-wrap items-center">
            <input
              type="text"
              name="address"
              required
              defaultValue={address}
              className="input w-full"
              disabled={isLoadingStatus}
            />
            {!position.latitude && !position.longitude && (
              <span
                className={`absolute right-[5px] sm:top-[5px] ${addressStatus === 'error' && 'top-[3px]'}`}
              >
                <Button
                  disabled={isLoadingStatus}
                  type={'small'}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('dispatching action...');
                    dispatch(fetchAddress());
                  }}
                >
                  Get Location
                </Button>
              </span>
            )}
            {addressStatus === 'error' && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {addressError}
              </p>
            )}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" value={JSON.stringify(cart)} name="cart" />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude},${position.longitude}`
                : ''
            }
          />
          <Button type="primary" disabled={isSubmitting || isLoadingStatus}>
            {isSubmitting
              ? 'Placing Order...'
              : `Order now ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };
  console.log(order);
  const error = {};
  if (!isValidPhone(order.phone))
    error.phone =
      'Please give us your correct phone number, We might need it to contact you.';

  if (Object.keys(error).length > 0) return error;
  const newOrder = await createOrder(order);
  // return order;
  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
  // return null;
}
export default CreateOrder;
