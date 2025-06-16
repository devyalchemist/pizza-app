import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTotalCartPrice, getTotalCartQuantity } from './CartSlice';
import { formatCurrency } from '../../utils/helpers';

function CartOverview() {
  const totalCost = useSelector(getTotalCartPrice);
  const numberOfPizzas = useSelector(getTotalCartQuantity);

  // const numberOfPizzas = cart.reduce((sum, item) => sum + item.quantity, 0);
  // const totalCost = cart.reduce(
  //   (initial, current) => initial + current.totalPrice,
  //   0,
  // );
  // console.log(cart);
  // const numberOfPizzasTypes = cart.length;
  if (!numberOfPizzas) return null;
  return (
    <div className="flex items-center justify-between bg-stone-800 p-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>{numberOfPizzas} pizzas</span>
        <span>{formatCurrency(totalCost)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
