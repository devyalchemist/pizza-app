import { useFetcher } from 'react-router-dom';
import Button from '../../ui/Button';
import { useEffect } from 'react';
import { updateOrder } from '../../services/apiRestaurant';

export default function UpdateOrder({ order }) {
  const fetcher = useFetcher();
  useEffect(() => {
    if (!fetcher.data && fetcher.state === 'idle') fetcher.load('');
  });
  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type={'primary'}>Make Priority</Button>
      <input type="hidden" value={'Onyedi'} name="customer" />
    </fetcher.Form>
  );
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const main = Object.fromEntries(formData);
  const mainObj = {
    ...main,
  };
  console.log(mainObj);
  const priorityData = { priority: true };
  const data = { ...mainObj };
  console.log(data);
  await updateOrder(params.id, priorityData);
  console.log('updated');
  return null;
}
