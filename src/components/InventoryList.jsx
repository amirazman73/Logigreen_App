import React from 'react';
import { Search, CheckCircle, AlertCircle } from 'lucide-react';

const InventoryList = ({ filteredItems, searchQuery }) => (
  <div className="space-y-4">
    {/* Search */}
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center">
        <Search className="w-5 h-5 text-gray-400 mr-3" />
        <input
          type="text"
          value={searchQuery}
          readOnly
          className="flex-1 border-0 focus:ring-0 focus:outline-none"
          placeholder="Search by item name or pallet ID..."
        />
      </div>
    </div>
    {/* Inventory List */}
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Pallet Items ({filteredItems.length})</h2>
      </div>
      <div className="divide-y max-h-96 overflow-y-auto">
        {filteredItems.map(item => (
          <div key={item.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium">{item.itemName}</span>
                  {item.quality === 'good' ? (
                    <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 ml-2" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Quantity: {item.quantity} | Pallet: {item.palletId}
                </p>
                {item.notes && (
                  <p className="text-sm text-gray-500 mt-1">Notes: {item.notes}</p>
                )}
              </div>
              <div className="flex items-center ml-4">
                {item.photo && (
                  <img src={item.photo} alt="Item" className="w-12 h-12 object-cover rounded mr-3" />
                )}
                <div className="text-right text-sm text-gray-500">
                  <p>{item.timestamp}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.quality === 'good'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.quality}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No items match your search' : 'No items added to pallets yet'}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default InventoryList; 