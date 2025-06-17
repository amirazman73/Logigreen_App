import React from 'react';

const AddItemForm = ({
  pallets,
  selectedPalletId,
  onSelectPallet,
  itemsToAdd,
  onItemChange,
  onAddItemRow,
  onRemoveItemRow,
  onSubmit,
  availableItems
}) => (
  <div className="space-y-6">
    {/* Part 1: Pallet Selection */}
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">1. Select a Pallet</h2>
      <div className="flex overflow-x-auto space-x-3 pb-3">
        {pallets.map(pallet => (
          <button
            key={pallet.id}
            onClick={() => onSelectPallet(pallet.id)}
            className={`px-4 py-2 rounded-full border-2 whitespace-nowrap ${
              selectedPalletId === pallet.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {pallet.id} ({pallet.type})
          </button>
        ))}
      </div>
    </div>

    {/* Part 2: Item Addition (only shows after a pallet is selected) */}
    {selectedPalletId && (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">2. Add Items to Pallet: <span className="text-blue-600">{selectedPalletId}</span></h2>
        
        <div className="space-y-3 mb-4">
          {itemsToAdd.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <select
                value={item.itemName}
                onChange={(e) => onItemChange(index, 'itemName', e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select an available item...</option>
                {availableItems.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => onItemChange(index, 'quantity', e.target.value)}
                className="w-24 border border-gray-300 rounded-md px-3 py-2"
                placeholder="Qty"
              />
              {itemsToAdd.length > 1 && (
                <button
                  onClick={() => onRemoveItemRow(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onAddItemRow}
            className="text-blue-600 font-medium hover:text-blue-800"
          >
            + Add Another Item
          </button>
          <button
            onClick={onSubmit}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 font-medium"
          >
            Add All Items to Pallet
          </button>
        </div>
      </div>
    )}
  </div>
);

export default AddItemForm;