import React from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

const QualityCheck = ({ itemsForQualityCheck, onSetStatus, onImageUpload }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold">Quality Check ({itemsForQualityCheck.filter(item => item.qualityStatus === 'pending').length} item types pending)</h2>
      <p className="text-sm text-gray-600">Review each item type from incoming shipments.</p>
    </div>
    <div className="divide-y max-h-[60vh] overflow-y-auto">
      {itemsForQualityCheck.map(item => {
        const isGood = item.qualityStatus === 'good';
        const isBad = item.qualityStatus === 'bad';
        
        return (
          <div key={item.id} className={`p-4 flex items-center justify-between transition-colors duration-300 ${isGood ? 'bg-green-50' : isBad ? 'bg-red-50' : ''}`}>
            <div className="flex items-center">
              {item.imageUrl && (
                <img src={item.imageUrl} alt="item" className="w-12 h-12 object-cover rounded mr-4" />
              )}
              <div>
                <p className="font-medium">{item.itemName}</p>
                {/* Display the quantity for this batch */}
                <p className="text-sm text-gray-500">Expected Quantity: {item.expectedQuantity}</p>
                <p className="text-sm text-gray-500">From Shipment: {item.shipmentId}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor={`image-upload-${item.id}`} className="cursor-pointer p-2 rounded-full hover:bg-gray-200">
                <Camera className="w-5 h-5 text-gray-600" />
                <input
                  id={`image-upload-${item.id}`}
                  type="file" accept="image/*" capture="environment" className="hidden"
                  onChange={(e) => onImageUpload(item.id, e)}
                />
              </label>
              <select
                value={item.qualityStatus}
                onChange={(e) => onSetStatus(item.id, e.target.value)}
                className={`border rounded-md px-3 py-2 ${
                  isGood ? 'border-green-400 bg-white' :
                  isBad ? 'border-red-400 bg-white' :
                  'border-gray-300'
                }`}
              >
                <option value="pending">Pending...</option>
                <option value="good">Good</option>
                <option value="bad">Damaged/Bad</option>
              </select>
            </div>
          </div>
        )
      })}
      {itemsForQualityCheck.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>No items are pending a quality check.</p>
        </div>
      )}
    </div>
  </div>
);

export default QualityCheck;