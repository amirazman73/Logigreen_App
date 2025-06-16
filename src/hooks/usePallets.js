import { useState } from 'react';

const usePallets = (initialPallets = []) => {
  const [pallets, setPallets] = useState(initialPallets);

  const addPallet = (newPallet) => {
    setPallets(prevPallets => [
      ...prevPallets,
      {
        id: newPallet.name,
        type: newPallet.type,
        customerID: newPallet.customerID,
        itemCount: 0,
        status: 'active',
        created: new Date().toLocaleString()
      }
    ]);
  };

  return {
    pallets,
    setPallets,
    addPallet
  };
};

export default usePallets; 