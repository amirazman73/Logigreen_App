import React from 'react';
import { predefinedItems } from '../data/predefined_Items';

const LogShipmentForm = ({
    newShipment,
    setNewShipment,
    addShipment,
    addExpectedItem,
    removeExpectedItem,
    updateExpectedItem,
    shipments
}) => {
    const availableItems = predefinedItems.filter(
        item => item.source === newShipment.sourceLocation
    );

    return (
    <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Log Incoming Shipment</h2>
        
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipment Code *</label>
                <input
                type="text"
                value={newShipment.shipmentCode}
                onChange={(e) => setNewShipment({...newShipment, shipmentCode: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., SHP-2025-001"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipment Date *</label>
                <input
                type="date"
                value={newShipment.shipmentDate}
                onChange={(e) => setNewShipment({...newShipment, shipmentDate: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
            </div>
            </div>

            {/* --- THIS IS THE NEW DROPDOWN --- */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Location *</label>
                <select
                    value={newShipment.sourceLocation}
                    onChange={(e) => setNewShipment({...newShipment, sourceLocation: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                    <option value="Uganda">Uganda</option>
                    <option value="India">India</option>
                </select>
            </div>

            <div>
            <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Expected Items</label>
                <button
                onClick={addExpectedItem}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                + Add Item
                </button>
            </div>
            
            <div className="space-y-3">
                {newShipment.expectedItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                    <select
                        value={item.itemName}
                        onChange={(e) => updateExpectedItem(index, 'itemName', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    >
                    <option value="">Select Item</option>
                    {availableItems.map((availableItem, idx) => (
                        <option key={idx} value={availableItem.name}>
                        {availableItem.name}
                        </option>
                    ))}
                    </select>

                    <input
                    type="number"
                    value={item.expectedQuantity}
                    onChange={(e) => updateExpectedItem(index, 'expectedQuantity', e.target.value)}
                    className="w-24 border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Qty"
                    />
                    {newShipment.expectedItems.length > 1 && (
                    <button
                        onClick={() => removeExpectedItem(index)}
                        className="text-red-600 hover:text-red-800 px-2"
                    >
                        ×
                    </button>
                    )}
                </div>
                ))}
            </div>
            </div>
            
            <button
            onClick={addShipment}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
            >
            Log Shipment
            </button>
        </div>
        </div>
    </div>
    );
}

export default LogShipmentForm;