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

  const updateItem = (id, updatedFields) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, ...updatedFields } : item
      )
    );
  }

  const removeItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return {
    items,
    setItems,
    addItem,
    updateItem,
    removeItem
  };
};

export default useItems;