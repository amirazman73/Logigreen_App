import { useState } from 'react';

const useShipments = (initialShipments = []) => {
  const [shipments, setShipments] = useState(initialShipments);

  const addShipment = (newShipment) => {
    setShipments(prevShipments => [
      ...prevShipments,
      {
        id: Date.now(),
        ...newShipment,
        created: new Date().toLocaleString(),
        status: 'received'
      }
    ]);
  };

  return {
    shipments,
    setShipments,
    addShipment
  };
};

export default useShipments; 