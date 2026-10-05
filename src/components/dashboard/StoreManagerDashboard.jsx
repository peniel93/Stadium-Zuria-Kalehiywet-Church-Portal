import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { Package, PlusCircle, Download, Printer, CheckCircle2, AlertTriangle } from 'lucide-react';

export const StoreManagerDashboard = () => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'add_asset'

  const assets = db?.store_assets || [
    { id: 'ast-1', name: 'Plastic Chairs - White', item_name: 'Plastic Chairs - White', category: 'Plastic Chairs', color: 'White', item_color: 'White', total: 350, total_quantity: 350, normal: 340, normal_quantity: 340, defective: 10, defective_quantity: 10, location: 'Store A', storage_location: 'Store A' },
    { id: 'ast-2', name: 'Plastic Chairs - Red', item_name: 'Plastic Chairs - Red', category: 'Plastic Chairs', color: 'Red', item_color: 'Red', total: 200, total_quantity: 200, normal: 200, normal_quantity: 200, defective: 0, defective_quantity: 0, location: 'Store A', storage_location: 'Store A' }
  ];

  const [assetForm, setAssetForm] = useState({
    name: '',
    category: 'Plastic Chairs',
    color: 'White',
    total_quantity: 50,
    normal_quantity: 48,
    defective_quantity: 2,
    location: 'Main Store Room'
  });

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!assetForm.name) {
      showToast("Item Name is required", "error");
      return;
    }

    const freshDb = getMockDB();
    if (!freshDb.store_assets) freshDb.store_assets = [];

    const newAst = {
      id: `ast-${Date.now()}`,
      name: assetForm.name,
      item_name: assetForm.name,
      category: assetForm.category,
      color: assetForm.color,
      item_color: assetForm.color,
      total: parseInt(assetForm.total_quantity) || 0,
      total_quantity: parseInt(assetForm.total_quantity) || 0,
      normal: parseInt(assetForm.normal_quantity) || 0,
      normal_quantity: parseInt(assetForm.normal_quantity) || 0,
      defective: parseInt(assetForm.defective_quantity) || 0,
      defective_quantity: parseInt(assetForm.defective_quantity) || 0,
      location: assetForm.location,
      storage_location: assetForm.location,
      updated_at: new Date().toISOString()
    };

    freshDb.store_assets.unshift(newAst);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Church Asset "${assetForm.name}" recorded in Database!`, "success");
    setActiveTab('inventory');
  };

  const handleExportCSV = () => {
    let csv = "Item Name,Category,Color,Total Qty,Normal Qty,Defective Qty,Storage Location\n";
    assets.forEach(a => {
      csv += `"${a.name}","${a.category}","${a.color}",${a.total},${a.normal},${a.defective},"${a.location}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Church_Store_Assets_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Exported store assets to CSV!", "success");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header & Tabs */}
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            Church Store Manager (CSM) Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Track church asset inventory, plastic chairs by color, normal vs defective status, and export reports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Package size={16} />
            <span>Store Asset Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('add_asset')}
            className={`btn ${activeTab === 'add_asset' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <PlusCircle size={16} />
            <span>Record New Asset</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Church Assets & Items Register</h3>
            <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
                <Download size={14} />
                <span>Export CSV</span>
              </button>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                <Printer size={14} />
                <span>Print Asset Report</span>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Color</th>
                  <th>Total Quantity</th>
                  <th>Normal Status</th>
                  <th>Defective Status</th>
                  <th>Storage Location</th>
                </tr>
              </thead>
              <tbody>
                {assets.map(a => (
                  <tr key={a.id}>
                    <td><strong>{a.name}</strong></td>
                    <td>{a.category}</td>
                    <td><span className="badge badge-warning">{a.color}</span></td>
                    <td><strong style={{ fontSize: '1rem' }}>{a.total}</strong></td>
                    <td><span className="badge badge-success">{a.normal} Normal</span></td>
                    <td>
                      {a.defective > 0 ? (
                        <span className="badge badge-danger">{a.defective} Defective</span>
                      ) : (
                        <span className="badge badge-success">0 Defective</span>
                      )}
                    </td>
                    <td>{a.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Record New Asset */}
      {activeTab === 'add_asset' && (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Record Church Asset Item
          </h3>

          <form onSubmit={handleAddAsset}>
            <div className="form-group">
              <label className="form-label">Item Name *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Plastic Chairs - Blue"
                value={assetForm.name}
                onChange={e => setAssetForm({ ...assetForm, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={assetForm.category}
                  onChange={e => setAssetForm({ ...assetForm, category: e.target.value })}
                >
                  <option value="Plastic Chairs">Plastic Chairs</option>
                  <option value="Wooden Chairs">Wooden Chairs</option>
                  <option value="Desks & Tables">Desks & Tables</option>
                  <option value="Beds & Blankets">Beds & Blankets</option>
                  <option value="Cups & Glasses">Cups & Glasses</option>
                  <option value="Vacuum Flasks">Vacuum Flasks & Bottles</option>
                  <option value="Keyboards">Keyboards & Instruments</option>
                  <option value="Speakers">Speakers & Sound</option>
                  <option value="Vehicles">Bikes & Cars</option>
                  <option value="Electronics">Stoves, Ovens & Electronics</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <select
                  className="form-control"
                  value={assetForm.color}
                  onChange={e => setAssetForm({ ...assetForm, color: e.target.value })}
                >
                  <option value="White">White</option>
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="Brown">Brown</option>
                  <option value="Black">Black</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Total Qty</label>
                <input
                  type="number"
                  required
                  className="form-control"
                  value={assetForm.total_quantity}
                  onChange={e => setAssetForm({ ...assetForm, total_quantity: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Normal Qty</label>
                <input
                  type="number"
                  required
                  className="form-control"
                  value={assetForm.normal_quantity}
                  onChange={e => setAssetForm({ ...assetForm, normal_quantity: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Defective Qty</label>
                <input
                  type="number"
                  required
                  className="form-control"
                  value={assetForm.defective_quantity}
                  onChange={e => setAssetForm({ ...assetForm, defective_quantity: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Storage Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Main Store Room B"
                value={assetForm.location}
                onChange={e => setAssetForm({ ...assetForm, location: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>Save Asset Record</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
