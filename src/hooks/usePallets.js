import { useState } from 'react';

const usePallets = (initialPallets = []) => {
  const [pallets, setPallets] = useState(initialPallets);

  const addPallet = (newPallet) => {
    const palletId = `${newPallet.type === 'inventory' ? 'INV' : 'ORD'}-${Date.now()}`;
    setPallets(prevPallets => [
      ...prevPallets,
      {
        id: palletId,
        ...newPallet,
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