import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import productReducer from "./slice/productSlice";
import cartReducer from "./slice/cartSlice";
import productDetailReducer from "./slice/productDetailSlice";
import orderReducer from "./slice/orderSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  productDetails: productDetailReducer,
  cart: cartReducer,
  orders:orderReducer,
});

const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware)
  devTools: process.env.NODE_ENV !== 'production',
});

// Middleware example
// const loggerMiddleware = (store) => (next) => (action) => {
//   console.log(action);
//   // Call next(action) to transfer action to reducers to update state and re-render
//   next(action);
// };

// Uncomment middleware and add it to the configureStore options if needed

// Example of subscribing to store changes
// store.subscribe(() => {
//   console.log(`Current state: ${store.getState().counter.count}`);
// });

// Example of dispatching actions
// store.dispatch(increment(1));
// store.dispatch(increment(4));
// store.dispatch(increment(5));

export default store;
