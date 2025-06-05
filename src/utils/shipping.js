export function calculateDiscrepancies(shipments, items) {
  return shipments.map(shipment => {
    const discrepancies = shipment.expectedItems.map(expectedItem => {
      const actualQuantity = items
        .filter(item => item.itemName.toLowerCase() === expectedItem.itemName.toLowerCase())
        .reduce((sum, item) => sum + parseInt(item.quantity), 0);
      const expected = parseInt(expectedItem.expectedQuantity);
      const difference = actualQuantity - expected;
      return {
        itemName: expectedItem.itemName,
        expected,
        actual: actualQuantity,
        difference,
        status: difference === 0 ? 'match' : (difference > 0 ? 'over' : 'under')
      };
    });
    return {
      shipmentCode: shipment.shipmentCode,
      shipmentDate: shipment.shipmentDate,
      discrepancies,
      hasIssues: discrepancies.some(d => d.difference !== 0)
    };
  });
} 