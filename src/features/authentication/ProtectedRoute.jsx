import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateName } from '../user/userSlice';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (username === '') {
      dispatch(updateName('Please provide a valid username'));
      navigate('/');
    }
  }, [navigate, dispatch, username]);
  return <div>{children}</div>;
}
