import { useDispatch } from 'react-redux';
import Button from '../../ui/Button';
import { deleteItem } from './CartSlice';

export default function DeleteItem({ pizzaId }) {
  const dispatch = useDispatch();
  function handleRemoveItem() {
    dispatch(deleteItem(pizzaId));
  }
  return (
    <Button type={'small'} onClick={handleRemoveItem}>
      Delete
    </Button>
  );
}
