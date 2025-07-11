import React, {createContext,useContext, useEffect, useReducer, useCallback} from 'react';
import axios from 'axios';
const CartContext = React.createContext();
export { CartContext };

// REDUCER HANDLING CART ACTIONS LIKE ADD, REMOVE, UPDATE QUANTITY AND ITEM.
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'HYDRATE_CART':
      return action.payload;
    case 'ADD_ITEM': {
      const payload = action.payload;
      if (!payload || !payload._id) return state;
      const {_id, item, quantity } = payload;
      const exists = state.find(ci => ci._id === _id);
      if (exists) {
        return state.map(ci =>  ci._id === _id ? { ...ci, quantity: ci.quantity + quantity } : ci)     
      }
      return [...state, { _id, item, quantity }];
    }
    case 'REMOVE_ITEM': {
      return state.filter(ci => ci._id !== action.payload);
    }
    case 'UPDATE_ITEM': {
      const payload = action.payload;
      if (!payload || !payload._id) return state;
      const { _id, quantity } = payload;
      return state.map(ci => ci._id === _id ? { ...ci, quantity } : ci);
    }
    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

// INITIALISE CART FROM LOCALSTORAGE
const initializer = () => {
  try{
    return JSON.parse(localStorage.getItem('cart')) || [];
  }catch{
    return [];
  }
};
export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);
  // PERSIST CART STATE TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // HYDRATE FROM SERVER API
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios.get('https://foodie-pee-backend.onrender.com/api/cart', {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => dispatch({ type: 'HYDRATE_CART', payload: res.data }))
    .catch(err =>{if (err.response?.status === 401) console.error(err) });
  }, [])

  // CALCULATE TOTAL COST AND TOTAL ITEM COUNT
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // FORMAT TOTAL ITEMS IN POWER
  const formatTotalItems = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  // DISPATCHER WRAPPED WITH useCALLBACK FOR PERFORMANCE
  const addToCart = useCallback((item, qty) => {
    const token = localStorage.getItem('authToken');
    const res =  axios.post('https://foodie-pee-backend.onrender.com/api/cart',
       { itemId: item._id, quantity: qty }, 
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    dispatch({ type: 'ADD_ITEM', payload: res.data });
  }, []);

  const removeFromCart = useCallback(async (_id) => {
    if (!_id) return console.error("Cannot remove item: ID is undefined");
    const token = localStorage.getItem('authToken');
    await axios.delete(
      `https://foodie-pee-backend.onrender.com/api/cart/${_id}`, 
      {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
      }
  )
    dispatch({ type: 'REMOVE_ITEM', payload: _id });
  }, []);

  const updateQuantity = useCallback(async (_id, qty) => {
    const token = localStorage.getItem('authToken');
    const res = await axios.put(
      `https://foodie-pee-backend.onrender.com/api/cart/${_id}`, 
      { quantity: qty },
      {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
      }
    )
    dispatch({ type: 'UPDATE_ITEM', payload: res.data });
  }, []);

  const clearCart = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    await axios.put('https://foodie-pee-backend.onrender.com/api/cart/clear',
    {}, 
    {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    }
  );
    dispatch({ type: 'CLEAR_CART' });
  }, [])

  const totalItems = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalAmount = cartItems.reduce((sum, ci) => {
    const price = ci?.item?.price ?? 0;
    const qty = ci?.quantity ?? 0;
    return sum + price * qty;
  }, 0);
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);
