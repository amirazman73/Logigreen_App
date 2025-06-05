import { useState } from 'react';

const useItems = (initialItems = []) => {
  const [items, setItems] = useState(initialItems);

  const addItem = (newItem) => {
    setItems(prevItems => [
      ...prevItems,
      {
        id: Date.now(),
        ...newItem,
        timestamp: new Date().toLocaleString(),
        status: 'on_pallet'
      }
    ]);
  };

  return {
    items,
    setItems,
    addItem
  };
};

export default useItems; 