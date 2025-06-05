import React, { useState } from 'react';
import { Package, ChevronDown, ChevronUp, Edit, Trash } from 'lucide-react';

const PalletList = ({ pallets, items, onEditItem, onDeleteItem }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (palletId) => {
    setExpanded(prev => ({ ...prev, [palletId]: !prev[palletId] }));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Active Pallets</h2>
      </div>
      <div className="divide-y">
        {pallets.map(pallet => (
          <div key={pallet.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center cursor-pointer" onClick={() => toggleExpand(pallet.id)}>
                <Package className="w-5 h-5 text-gray-500 mr-2" />
                <span className="font-medium">{pallet.id}</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  pallet.type === 'inventory' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {pallet.type}
                </span>
                {expanded[pallet.id] ? <ChevronUp className="ml-2 w-4 h-4" /> : <ChevronDown className="ml-2 w-4 h-4" />}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{pallet.created}</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  pallet.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {pallet.status}
                </span>
              </div>
            </div>
            {expanded[pallet.id] && (
              <div className="mt-2 pl-8">
                <ul>
                  {items.filter(item => item.palletId === pallet.id).map(item => (
                    <li key={item.id} className="flex items-center justify-between py-1">
                      <span>{item.itemName} (Qty: {item.quantity})</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => onEditItem(item)} className="hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => onDeleteItem(item.id)} className="hover:text-red-600"><Trash className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </li>
                  ))}
                  {items.filter(item => item.palletId === pallet.id).length === 0 && (
                    <li className="text-gray-400">No items in this pallet.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
        {pallets.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No pallets created yet
          </div>
        )}
      </div>
    </div>
  );
};

export default PalletList; 