import React, { createContext, useState } from "react";

// Create the context
export const OrderContext = createContext();

// Create the provider component
export const OrderProvider = ({ children }) => {
  const [ordersChanged, setOrdersChanged] = useState(false);

  return (
    <OrderContext.Provider value={{ ordersChanged, setOrdersChanged }}>
      {children}
    </OrderContext.Provider>
  );
};
