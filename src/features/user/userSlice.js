import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAddress } from '../../services/apiGeocoding';
function getPosition() {
  console.log('getLocationTriggered');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log('Position obtained:', pos);
        resolve(pos);
      },
      (err) => {
        console.error('Geolocation error:', err);
        console.log(err);
        reject(err);
      },
    );
  });
}
// export const fetchAddress = createAsyncThunk(
//   'user/fetchAddress',
//   async function (_, thunkAPI) {
//     try {
//       console.log('Getting position...');
//       const positionObj = await getPosition();

//       const position = {
//         latitude: positionObj.coords.latitude,
//         longitude: positionObj.coords.longitude,
//       };

//       console.log('Fetching address...');
//       const addressObj = await getAddress(position);
//       const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

//       console.log('Returning final result...');
//       return { position, address };
//     } catch (err) {
//       console.error('fetchAddress error:', err.message);
//       return thunkAPI.rejectWithValue(err.message); // use this to get a better error
//     }
//   },
// );
/*export const fetchAddress = createAsyncThunk(
  'user/fetchAddress',
  async function () {
    // 1) We get the user's geolocation position
    try {
      const positionObj = await getPosition();
      const position = {
        latitude: positionObj.coords.latitude,
        longitude: positionObj.coords.longitude,
      };

      // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
      const addressObj = await getAddress(position);
      const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

      // 3) Then we return an object with the data that we are interested in
      return { position, address };
      // return err.message;
    } catch (err) {
      console.error(err);
      return null;
      // return err.message || 'Failed to fetch location/address'
    }
  },
);*/
export const fetchAddress = createAsyncThunk(
  'user/fetchAddress',
  async function () {
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in
    return { position, address };
    // return err.message;
  },
);

const initialState = {
  username: '',
  status: 'idle',
  position: {},
  address: '',
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action) {
      if (action.payload === '') return null;
      if (action.payload === 'Please provide a valid username') {
        state.username = '';
      } else {  
        state.username = action.payload;
      }
    },
    reset(state) {
      state.status = 'idle';
      state.position = {};
      state.address = '';
      state.error = '';
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.status = 'idle';
        state.address = action.payload.address;
        state.position = action.payload.position;
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = 'error';
        state.address = '';
        state.position = {};
        // console.log(action.error);
        state.error = action.error.message;
      }),
});

export default userSlice.reducer;
export const { updateName, reset } = userSlice.actions;

async function showUserLocation() {
  try {
    const position = await getPosition(); // waits for the location
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
  } catch (err) {
    console.error('Failed to get location:', err.message);
  }
}
