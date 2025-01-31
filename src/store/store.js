import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = () => useSelector;