import { useState } from 'react';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { updateName } from '../user/userSlice';
import { useNavigate } from 'react-router-dom';

function CreateUser() {
  const [username, setUsername] = useState('');
  const inputUser = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (username === '') return;
    dispatch(updateName(username));
    navigate('/menu');
    setUsername('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-stome-600 mb-4 text-sm md:text-base">
        👋 Welcome! Please start by telling us your name:
      </p>

      <input
        type="text"
        placeholder="Your full name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input mb-8 w-72"
      />

      {(username !== '' || inputUser) && (
        <div>
          <Button type={'primary'} disabled={false}>
            {/* {inputUser || username !== '' ? 'Start ordering' : 'Invalid User'} */}
            {username !== '' ? 'Start Ordering' : inputUser && 'Invalid User'}
          </Button>
        </div>
      )}
    </form>
  );
}

export default CreateUser;
