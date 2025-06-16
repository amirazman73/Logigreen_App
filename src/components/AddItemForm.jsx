import React from 'react';
import { Camera } from 'lucide-react';

const AddItemForm = ({ newItem, setNewItem, addItem, pallets, fileInputRef, handlePhotoCapture, availableItems}) => (
  <div className="max-w-md mx-auto">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Add Item to Pallet</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
          <select
            value={newItem.itemName}
            onChange={(e) => setNewItem({...newItem, itemName: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select an Available Item</option>
            {availableItems.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
          <input
            type="number"
            value={newItem.quantity}
            onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pallet ID *</label>
          <select
            value={newItem.palletId}
            onChange={(e) => setNewItem({...newItem, palletId: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select Pallet</option>
            {pallets.filter(p => p.status === 'active').map(pallet => (
              <option key={pallet.id} value={pallet.id}>{pallet.id}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quality Check</label>
          <select
            value={newItem.quality}
            onChange={(e) => setNewItem({...newItem, quality: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="good">Good</option>
            <option value="bad">Damaged/Bad</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handlePhotoCapture}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-md py-4 hover:border-gray-400"
          >
            <Camera className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Take Photo</span>
          </button>
          {newItem.photo && (
            <img src={newItem.photo} alt="Item" className="mt-2 w-full h-32 object-cover rounded" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={newItem.notes}
            onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows="2"
            placeholder="Additional notes..."
          />
        </div>
        <button
          onClick={addItem}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
        >
          Add to Pallet
        </button>
      </div>
    </div>
  </div>
);

export default AddItemForm; 