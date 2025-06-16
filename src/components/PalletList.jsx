import React, { useState } from 'react';
import { Package, ChevronDown, ChevronUp, Edit, Trash, Check, X } from 'lucide-react';

// This is a new sub-component that will handle the editing form
const EditItemRow = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    quantity: item.quantity,
    quality: item.quality,
    notes: item.notes || ''
  });

  const handleSave = () => {
    if (!formData.quantity || formData.quantity <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }
    onSave(item.id, formData);
  };

  return (
    <div className="flex items-center justify-between py-2 bg-blue-50 p-2 rounded-lg">
      <div className="flex-1 grid grid-cols-2 gap-3">
        {/* Quantity Input */}
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="border border-gray-300 rounded-md px-2 py-1"
        />
        {/* Quality Select */}
        <select
          value={formData.quality}
          onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
          className="border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="good">Good</option>
          <option value="bad">Damaged/Bad</option>
        </select>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button onClick={handleSave} className="hover:text-green-600"><Check className="w-5 h-5 text-green-500" /></button>
        <button onClick={onCancel} className="hover:text-red-600"><X className="w-5 h-5 text-red-500" /></button>
      </div>
    </div>
  );
};


const PalletList = ({ pallets, items, editingItemId, onEditItem, onCancelEdit, onSaveItem, onDeleteItem }) => {
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
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(pallet.id)}>
              <div className="flex items-center">
                  <Package className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="font-medium">{pallet.id}</span>
                  {expanded[pallet.id] ? <ChevronUp className="ml-2 w-4 h-4" /> : <ChevronDown className="ml-2 w-4 h-4" />}
              </div>
              <div className="text-right">
                  <p className="text-sm text-gray-500">{pallet.created}</p>
              </div>
            </div>

            {expanded[pallet.id] && (
              <div className="mt-4 pl-8 space-y-2">
                <ul>
                  {items.filter(item => item.palletId === pallet.id).map(item => (
                    <li key={item.id}>
                      {editingItemId === item.id ? (
                        <EditItemRow
                            item={item}
                            onSave={onSaveItem}
                            onCancel={onCancelEdit}
                        />
                      ) : (
                        <div className="flex items-center justify-between py-1">
                          <span>{item.itemName} (Qty: {item.quantity}) - <em className="text-gray-500">{item.quality}</em></span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => onEditItem(item.id)} className="hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => onDeleteItem(item.id)} className="hover:text-red-600"><Trash className="w-4 h-4 text-red-500" /></button>
                          </div>
                        </div>
                      )}
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
      </div>
    </div>
  );
};

export default PalletList;