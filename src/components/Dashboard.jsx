import React from 'react';
import { Truck, AlertCircle, CheckCircle, FileText } from 'lucide-react';

const Dashboard = ({ stats, discrepancies, shipments, handleGeneratePDF }) => (
  <div className="space-y-6">
    {/* Generate PDF Button */}
    <button
      onClick={handleGeneratePDF}
      className="mb-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
    >
      Generate PDF Report
    </button>
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <Truck className="w-8 h-8 text-green-500 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Active Pallets</p>
            <p className="text-2xl font-bold">{stats.activePallets}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Quality Issues</p>
            <p className="text-2xl font-bold">{stats.qualityIssues}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Shipment Discrepancy Table */}
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Shipment vs Actual Count</h2>
        <p className="text-sm text-gray-600">Compare expected quantities with actual warehouse counts</p>
      </div>
      <div className="overflow-x-auto">
        {discrepancies.length > 0 ? (
          discrepancies.map(shipment => (
            <div key={shipment.shipmentCode} className="border-b last:border-b-0">
              <div className={`p-4 ${shipment.hasIssues ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{shipment.shipmentCode}</h3>
                    <p className="text-sm text-gray-600">Date: {shipment.shipmentDate}</p>
                  </div>
                  {shipment.hasIssues ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Item</th>
                      <th className="text-right py-2">Expected</th>
                      <th className="text-right py-2">Actual</th>
                      <th className="text-right py-2">Difference</th>
                      <th className="text-right py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipment.discrepancies.map((item, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="py-2">{item.itemName}</td>
                        <td className="text-right py-2">{item.expected}</td>
                        <td className="text-right py-2">{item.actual}</td>
                        <td className={`text-right py-2 font-medium ${
                          item.difference > 0 ? 'text-blue-600' : 
                          item.difference < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {item.difference > 0 ? '+' : ''}{item.difference}
                        </td>
                        <td className="text-right py-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.status === 'match' ? 'bg-green-100 text-green-800' :
                            item.status === 'over' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status === 'match' ? 'Match' : 
                            item.status === 'over' ? 'Over' : 'Under'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No shipments logged yet</p>
            <p className="text-sm">Use the "Log Shipment" tab to record expected quantities</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default Dashboard;