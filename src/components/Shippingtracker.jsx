import React, { useState, useRef } from 'react';
import { Eye, FileText, Plus, Package, Search } from 'lucide-react';
import Dashboard from './Dashboard';
import LogShipmentForm from './LogShipmentForm';
import AddItemForm from './AddItemForm';
import PalletList from './PalletList';
import InventoryList from './InventoryList';
import useItems from '../hooks/useItems';
import usePallets from '../hooks/usePallets';
import useShipments from '../hooks/useShipments';
import { calculateDiscrepancies } from '../utils/shipping';
import QualityCheck from './QualityCheck'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ShippingTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newItem, setNewItem] = useState({
    itemName: '',
    quantity: '',
    palletId: '',
    quality: 'good',
    photo: null,
    notes: ''
  });
  const [newPallet, setNewPallet] = useState({
    name : '',
    type: 'inventory',
    customerId: '',
    destination: '',
    storage: 'OUTSIDE'
  });
  const [newShipment, setNewShipment] = useState({

    shipmentIdPart1: 'AWB',
    shipmentIdPart2: '',
    shipmentIdPart3: '',
    shipmentDate: '',
    sourceLocation: 'Uganda',
    expectedItems: [{ itemName: '', expectedQuantity: '' }]
  });
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  const [editingItemId, setEditingItemId] = useState(null);

  // Custom hooks for state management
  const { items, setItems, addItem, updateItem, removeItem } = useItems();
  const { pallets, setPallets, addPallet } = usePallets();
  const { shipments, setShipments, addShipment } = useShipments();

  const [draftItemsByPallet, setDraftItemsByPallet] = useState({});
  const [selectedPalletId, setSelectedPalletId] = useState(null);

  // This line gets the draft for the currently selected pallet, or provides a default empty row.
  const itemsToAdd = draftItemsByPallet[selectedPalletId] || [{ itemName: '', quantity: '' }];

  const [itemsForQualityCheck, setItemsForQualityCheck] = useState([]);


  // Add item handler, this was the original code that was commented out
  /*
  const handleAddItem = () => {
    if (!newItem.itemName || !newItem.quantity || !newItem.palletId) {
      alert('Please fill in all required fields');
      return;
    }


    const selectedPallet = pallets.find(p => p.id === newItem.palletId);
    if (!selectedPallet) {
      alert('Selected pallet does not exist');
      return;
    }

    const storageLocation = selectedPallet.type === 'inventory' ? selectedPallet.storage : 'N/A';

    const itemToAdd = {
      ...newItem,
      storage: storageLocation,
    };

    addItem(itemToAdd);

    setPallets(pallets.map(pallet =>
      pallet.id === newItem.palletId
        ? { ...pallet, itemCount: pallet.itemCount + parseInt(newItem.quantity) }
        : pallet
    ));

    setNewItem({
      itemName: '',
      quantity: '',
      palletId: '',
      quality: 'good',
      photo: null,
      notes: ''
    });
  };
  */

  const handleSelectPallet = (palletId) => {
    setSelectedPalletId(palletId);
  };

  const handleItemToAddChange = (index, field, value) => {
    // Get the current draft list for the selected pallet
    const currentDraft = draftItemsByPallet[selectedPalletId] || [{ itemName: '', quantity: '' }];
    
    // Update the specific item in the draft list
    const updatedItems = currentDraft.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    
    // Save the updated draft list back into our main drafts state
    setDraftItemsByPallet(prevDrafts => ({
      ...prevDrafts,
      [selectedPalletId]: updatedItems
    }));
  };

  const addNewItemToAddRow = () => {
    const currentDraft = draftItemsByPallet[selectedPalletId] || [{ itemName: '', quantity: '' }];
    setDraftItemsByPallet(prevDrafts => ({
      ...prevDrafts,
      [selectedPalletId]: [...currentDraft, { itemName: '', quantity: '' }]
    }));
  };

  const removeItemToAddRow = (index) => {
    const currentDraft = draftItemsByPallet[selectedPalletId];
    if (currentDraft && currentDraft.length > 1) {
      setDraftItemsByPallet(prevDrafts => ({
        ...prevDrafts,
        [selectedPalletId]: currentDraft.filter((_, i) => i !== index)
      }));
    }
  };

  const handleBulkAddItems = () => {
    if (!selectedPalletId) { /* ... */ return; }
    const draftToSubmit = draftItemsByPallet[selectedPalletId] || [];
    const validItemsToAdd = draftToSubmit.filter(item => item.itemName && item.quantity > 0);
    if (validItemsToAdd.length === 0) { /* ... */ return; }

    // First, validate that the requested quantities do not exceed available quantities
    for (const itemToAdd of validItemsToAdd) {
        const qcItem = itemsForQualityCheck.find(i => i.itemName === itemToAdd.itemName);
        if (!qcItem || parseInt(itemToAdd.quantity) > parseInt(qcItem.expectedQuantity)) {
            alert(`Error: You are trying to add ${itemToAdd.quantity} ${itemToAdd.itemName}, but only ${qcItem?.expectedQuantity || 0} are available from the quality check list.`);
            return; // Stop the process if validation fails
        }
    }

    // If validation passes, add the items
    validItemsToAdd.forEach(itemToAdd => {
        const qualityInfo = itemsForQualityCheck.find(qcItem => qcItem.itemName === itemToAdd.itemName);
        const quality = qualityInfo ? qualityInfo.qualityStatus : 'good';
        
        const selectedPallet = pallets.find(p => p.id === selectedPalletId);
        const storageLocation = selectedPallet.type === 'inventory' ? selectedPallet.storage : 'N/A';

        addItem({
            itemName: itemToAdd.itemName,
            quantity: itemToAdd.quantity,
            palletId: selectedPalletId,
            quality: quality,
            notes: '',
            storage: storageLocation,
        });
    });

    // Now, update the quantities in the quality check list
    let updatedQcItems = [...itemsForQualityCheck];
    validItemsToAdd.forEach(itemToAdd => {
        const itemIndex = updatedQcItems.findIndex(qcItem => qcItem.itemName === itemToAdd.itemName);
        if (itemIndex > -1) {
            const currentItem = updatedQcItems[itemIndex];
            const newQuantity = parseInt(currentItem.expectedQuantity) - parseInt(itemToAdd.quantity);
            
            // Update the item with the new quantity
            updatedQcItems[itemIndex] = { ...currentItem, expectedQuantity: newQuantity };
        }
    });

    // Filter out any items from the QC list where the quantity is now zero
    setItemsForQualityCheck(updatedQcItems.filter(item => item.expectedQuantity > 0));
    
    // --- END: New and Corrected Logic ---

    alert(`${validItemsToAdd.length} item type(s) have been added to pallet ${selectedPalletId}.`);
    
    // Reset the form
    setDraftItemsByPallet(prevDrafts => {
      const newDrafts = { ...prevDrafts };
      delete newDrafts[selectedPalletId];
      return newDrafts;
    });
    setSelectedPalletId(null);
  };

  const handleSaveItem = (itemId, dataToSave) => {
    updateItem(itemId, dataToSave);
    setEditingItemId(null);
  };

  const onDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      removeItem(itemId);
    }
  };

  // Add pallet handler
  const handleAddPallet = () => {
    // 1. Validate for empty name
    if (!newPallet.name.trim()) {
      alert('Pallet Name cannot be empty.');
      return;
    }
    // 2. Validate for unique name
    if (pallets.some(pallet => pallet.id === newPallet.name.trim())) {
      alert('A pallet with this name already exists. Please use a unique name.');
      return;
    }

    // If validation passes, add the pallet
    addPallet({
      ...newPallet,
      name: newPallet.name.trim() // Pass the trimmed name
    });

    // Reset the form
    setNewPallet({ name: '', type: 'inventory', customerId: '', destination: '' });
  };

  // Shipment form handlers
  const addExpectedItem = () => {
    setNewShipment({
      ...newShipment,
      expectedItems: [...newShipment.expectedItems, { itemName: '', expectedQuantity: '' }]
    });
  };
  const removeExpectedItem = (index) => {
    const updatedItems = newShipment.expectedItems.filter((_, i) => i !== index);
    setNewShipment({ ...newShipment, expectedItems: updatedItems });
  };
  const updateExpectedItem = (index, field, value) => {
    const updatedItems = newShipment.expectedItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setNewShipment({ ...newShipment, expectedItems: updatedItems });
  };

  const handleAddShipment = () => {
    if (!newShipment.shipmentIdPart1 || !newShipment.shipmentIdPart2 || !newShipment.shipmentIdPart3 || !newShipment.shipmentDate) {
      alert('Please fill in all parts of the shipment ID and the date.');
      return;
    }
    const validItems = newShipment.expectedItems.filter(item => item.itemName && item.expectedQuantity);
    if (validItems.length === 0) {
      alert('Please add at least one item to the shipment');
      return;
    }
    const combinedShipmentCode = `${newShipment.shipmentIdPart1}-${newShipment.shipmentIdPart2}-${newShipment.shipmentIdPart3}`;
    addShipment({
      shipmentCode: combinedShipmentCode,
      shipmentDate: newShipment.shipmentDate,
      sourceLocation: newShipment.sourceLocation,
      expectedItems: validItems
    });

    const qualityCheckItems = validItems.flatMap(item => ({
      id: `${combinedShipmentCode}-${item.itemName}`,
      itemName: item.itemName,
      shipmentId: combinedShipmentCode,
      expectedQuantity: item.expectedQuantity,
      qualityStatus: 'pending',
      imageUrl: null,
    }));
    setItemsForQualityCheck(prev => [...prev, ...qualityCheckItems]);

    setNewShipment({
      shipmentIdPart1: 'AWB',
      shipmentIdPart2: '',
      shipmentIdPart3: '',
      shipmentDate: '',
      sourceLocation: 'Uganda',
      expectedItems: [{ itemName: '', expectedQuantity: '' }]
    });
  };

  // DEFINED: The missing handleSetQualityStatus function
  const handleSetQualityStatus = (itemId, status) => {
    setItemsForQualityCheck(itemsForQualityCheck.map(item =>
      item.id === itemId ? { ...item, qualityStatus: status } : item
    ));
  };
  
  const handleQualityCheckImageUpload = (itemId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setItemsForQualityCheck(itemsForQualityCheck.map(item =>
          item.id === itemId ? { ...item, imageUrl } : item
        ));
      };
      reader.readAsDataURL(file);
    }
  };


  // Photo capture handler
  const handlePhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewItem({ ...newItem, photo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered items for inventory
  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.palletId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dashboard stats
  const stats = {
    activePallets: pallets.filter(p => p.status === 'active').length,
    qualityIssues: items.filter(i => i.quality === 'bad').length
  };

  // Discrepancies
  const discrepancies = calculateDiscrepancies(shipments, items);

  // 1. Get all unique item names from incoming shipments using flatMap.
  const itemsInShipments = shipments.flatMap(s => s.expectedItems.map(i => i.itemName));

  // 2. Get all unique item names from items already in inventory.
  const itemsInInventory = items.map(i => i.itemName);

  // 3. Combine them and create a unique list of names.
  const availableItemsForPallets = [
    ...new Set(
      itemsForQualityCheck
        .filter(item => item.qualityStatus !== 'pending' && item.expectedQuantity > 0)
        .map(item => item.itemName)
    )
  ];



  // Edit and delete handlers for pallet items
  const onEditItem = (item) => {
    setEditingItemId(item.id);
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    let yPos = 20; // A single variable to track the vertical position

    // Date
    doc.setFontSize(22);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 14, yPos);
    yPos += 15;

    // Shipment Details
    doc.setFontSize(16);
    doc.text('Shipment Details', 14, yPos);
    yPos += 7;
    doc.setFontSize(12);
    shipments.forEach((shipment) => {
      doc.text(
        `${shipment.shipmentCode} from ${shipment.sourceLocation} — Date: ${shipment.shipmentDate}`,
        14,
        yPos
      );
      yPos += 7;
    });

    // --- START: New and Corrected "Arrival Summary" Section ---
    yPos += 10;
    doc.setFontSize(16);
    doc.text('Arrival Summary', 14, yPos);
    yPos += 2;

    // Loop through each shipment's discrepancy report
    discrepancies.forEach(shipmentReport => {
        if (shipmentReport.discrepancies.length === 0) return;

        yPos += 5; // Add space before each new table

        // Create the table body for this specific shipment
        const tableBody = shipmentReport.discrepancies.map((item, idx) => [
            idx + 1,
            item.itemName,
            item.expected,
            item.actual,
            item.difference > 0 ? `+${item.difference}` : item.difference,
            !item.quality.includes('bad') ? 'good' : 'bad' // The robust quality check
        ]);
        
        // Use autoTable to draw a separate table for each shipment
        autoTable(doc, {
            startY: yPos,
            // Use the shipment code as a title in the header
            head: [
                [{ content: `Shipment: ${shipmentReport.shipmentCode}`, colSpan: 6, styles: { fontStyle: 'bold', fillColor: [230, 230, 230], textColor: 20 } }],
                ['SNo.', 'Items', 'Planned', 'Actual', 'Difference', 'Quality Check']
            ],
            body: tableBody,
            theme: 'grid',
            styles: { fontSize: 10 },
        });

        // Update the yPos to be below the table we just drew
        yPos = doc.lastAutoTable.finalY;
    });
    // --- END: New "Arrival Summary" Section ---

    // Pallet Inventory Report section
    let palletTableStartY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.text('Pallet Inventory Report', 14, palletTableStartY);


    pallets.forEach(pallet => {
        const palletItems = items.filter(i => i.palletId === pallet.id);

        if (palletItems.length === 0) {
            return;
        }

        let tableHead;
        let tableBody;

        // FIX 1: Use backticks (`) for the template literal
        const palletTitle = `Pallet: ${pallet.id} (${pallet.type})` + (pallet.customerId ? ` - Order: ${pallet.customerId}` : '');

        if (pallet.type === 'inventory') {
            tableHead = [[palletTitle, 'Quantity', 'Quality', 'Storage']];
            tableBody = palletItems.map(item => {
                return [item.itemName, item.quantity, item.quality, item.storage || 'N/A'];
            });
        } else {
            tableHead = [[palletTitle, 'Quantity', 'Quality']];
            tableBody = palletItems.map(item => {
                return [item.itemName, item.quantity, item.quality];
            }); // FIX 2: Added the closing parenthesis and curly brace
        }

        // This code now runs for BOTH inventory and order pallets
        palletTableStartY = doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY + 5 : palletTableStartY + 5;
        
        autoTable(doc, {
            startY: palletTableStartY,
            head: tableHead, // FIX 3: Use the dynamic tableHead variable
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: pallet.type === 'order' ? [100, 100, 200] : [60, 150, 60] }
        });
    }); // Closes the forEach loop
    
    doc.save('shipment_report.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">LogiGreen Inventory Management</h1>
      </div>
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Eye },
            { id: 'log-shipment', label: 'Log Shipment', icon: FileText },
            { id: 'quality-check', label: 'Quality Check', icon: Search },
            { id: 'add-item', label: 'Add to Pallet', icon: Plus },
            { id: 'pallets', label: 'Pallets', icon: Package },
            { id: 'inventory', label: 'Inventory', icon: Search }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <Dashboard stats={stats} discrepancies={discrepancies} shipments={shipments} handleGeneratePDF={handleGeneratePDF} />
        )}
        {/* Log Shipment Tab */}
        {activeTab === 'log-shipment' && (
          <LogShipmentForm
            newShipment={newShipment}
            setNewShipment={setNewShipment}
            addShipment={handleAddShipment}
            addExpectedItem={addExpectedItem}
            removeExpectedItem={removeExpectedItem}
            updateExpectedItem={updateExpectedItem}
            shipments={shipments}
          />
        )}
        {/* Quality Check Tab */}
        {activeTab === 'quality-check' && (
          <QualityCheck 
            itemsForQualityCheck={itemsForQualityCheck}
            onSetStatus={handleSetQualityStatus}
            onImageUpload={handleQualityCheckImageUpload}
          />
        )}
        {/* Add Item to Pallet Tab */}
        {activeTab === 'add-item' && (
          <AddItemForm
            pallets={pallets}
            selectedPalletId={selectedPalletId}
            onSelectPallet={handleSelectPallet}
            itemsToAdd={itemsToAdd}
            onItemChange={handleItemToAddChange}
            onAddItemRow={addNewItemToAddRow}
            onRemoveItemRow={removeItemToAddRow}
            onSubmit={handleBulkAddItems}
            availableItems={availableItemsForPallets}
          />
        )}
        {/* Pallets Tab */}
        {activeTab === 'pallets' && (
          <div className="space-y-6">
            {/* Add New Pallet */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Pallet</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* ADD THIS NEW INPUT FIELD */}
                <input
                  type="text"
                  value={newPallet.name}
                  onChange={(e) => setNewPallet({ ...newPallet, name: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 md:col-span-1"
                  placeholder="Pallet Name (e.g., A-01)"
                />
                <select
                  value={newPallet.type}
                  onChange={(e) => setNewPallet({ ...newPallet, type: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="inventory">Inventory Pallet</option>
                  <option value="order">Order Pallet</option>
                </select>
                {/* ADD THIS NEW DROPDOWN */}
                {newPallet.type === 'inventory' && (
                  <select
                    value={newPallet.storage}
                    onChange={(e) => setNewPallet({ ...newPallet, storage: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="OUTSIDE">Outside Fridge</option>
                    <option value="INSIDE">Inside Fridge</option>
                  </select>
                )}
                {newPallet.type === 'order' && (
                  <input
                    type="text"
                    value={newPallet.customerId}
                    onChange={(e) => setNewPallet({ ...newPallet, customerId: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Customer Order ID"
                  />
                )}
                <button
                  onClick={handleAddPallet}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Create Pallet
                </button>
              </div>
            </div>
            {/* Pallet List */}
            <PalletList 
              pallets={pallets} 
              items={items} 
              editingItemId={editingItemId}
              onEditItem={setEditingItemId} 
              onCancelEdit={() => setEditingItemId(null)}
              onSaveItem={handleSaveItem}
              onDeleteItem={onDeleteItem} />
          </div>
        )}
        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <InventoryList filteredItems={filteredItems} searchQuery={searchQuery} />
        )}
        {/* Inventory Search Input (for inventory tab) */}
        {activeTab === 'inventory' && (
          <div className="mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Search by item name or pallet ID..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingTracker;