import { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../apiConfig/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
    const [inventory, setInventory] = useState([]);
    const [ledger, setLedger] = useState({ sales: [], purchases: [] });
    const [lastEvent, setLastEvent] = useState(null);

    const [salesDetails, setSalesDetails] = useState([]);

    const fetchAll = async () => {
        const [inv, led, saleDetailRes] = await Promise.all([
            axiosInstance.get('/inventory'),
            axiosInstance.get('/ledger'),
            axiosInstance.get('/sales-details'),
        ]);
        setInventory(inv.data);
        setLedger(led.data);
        setSalesDetails(saleDetailRes.data);
    };

    useEffect(() => {
        fetchAll();
        const interval = setInterval(fetchAll, 5000);
        return () => clearInterval(interval);
    }, []);

    const simulate = async () => {
        const res = await axiosInstance.post('/simulate');
        setLastEvent(res.data.event);
        alert(`Simulated: ${res.data.event.event_type.toUpperCase()} for ${res.data.event.product_id} of qty ${res.data.event.quantity}`);
    };

    // Group batch info by sale_id
    const batchMap = useMemo(() => {
        const map = {};
        for (const row of salesDetails) {
            if (!map[row.sale_id]) map[row.sale_id] = [];
            map[row.sale_id].push({
                unit_price: row.unit_price,
                batch_time: row.batch_time,
            });
        }
        return map;
    }, [salesDetails]);


    const productStats = useMemo(() => {
        const stats = {};
        ledger.sales.forEach(sale => {
            if (!stats[sale.product_id]) stats[sale.product_id] = { salesQty: 0, salesCount: 0, purchaseQty: 0, purchaseCount: 0 };
            stats[sale.product_id].salesQty += sale.quantity;
            stats[sale.product_id].salesCount += 1;
        });
        ledger.purchases.forEach(purchase => {
            if (!stats[purchase.product_id]) stats[purchase.product_id] = { salesQty: 0, salesCount: 0, purchaseQty: 0, purchaseCount: 0 };
            stats[purchase.product_id].purchaseQty += purchase.quantity;
            stats[purchase.product_id].purchaseCount += 1;
        });
        return stats;
    }, [ledger]);

    // Sort ledger by timestamp descending
    const sortedSales = [...ledger.sales].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const sortedPurchases = [...ledger.purchases].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="dashboard-container">
            <div className="card-row">
                <div className="card">
                    <h2>Total Inventory Items</h2>
                    <p>{inventory.length}</p>
                </div>
                <div className="card">
                    <h2>Total Sales</h2>
                    <p>{ledger.sales.length}</p>
                </div>
                <div className="card">
                    <h2>Total Purchases</h2>
                    <p>{ledger.purchases.length}</p>
                </div>
            </div>

            {lastEvent && (
                <div style={{ padding: '10px', background: '#fef9c3', borderRadius: 8, marginBottom: '20px' }}>
                    <strong>Last Simulated Event:</strong> {lastEvent.event_type.toUpperCase()} for <b>{lastEvent.product_id}</b> → Qty: <b>{lastEvent.quantity}</b> {lastEvent.unit_price ? `@ ₹${lastEvent.unit_price}` : '(FIFO Cost applied)'}
                </div>
            )}

            <div className="table-container">
                <h2>Inventory Summary (Live FIFO View)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Current Qty</th>
                            <th>Total Cost (₹)</th>
                            <th>Avg Unit Cost (₹)</th>
                            <th>Sales Qty</th>
                            <th>Sales Count</th>
                            <th>Purchase Qty</th>
                            <th>Purchase Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => {
                            const stats = productStats[item.product_id] || {
                                salesQty: 0,
                                salesCount: 0,
                                purchaseQty: 0,
                                purchaseCount: 0,
                            };
                            const highlight =
                                lastEvent && item.product_id === lastEvent.product_id
                                    ? '#fff7ed' // Highlight 
                                    : 'transparent';
                            return (
                                <tr key={item.product_id} style={{ backgroundColor: highlight }}>
                                    <td>{item.product_id}</td>
                                    <td>{item.current_quantity}</td>
                                    <td>{item.total_cost}</td>
                                    <td>{item.avg_unit_cost || '-'}</td>
                                    <td>{stats.salesQty}</td>
                                    <td>{stats.salesCount}</td>
                                    <td>{stats.purchaseQty}</td>
                                    <td>{stats.purchaseCount}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="table-container">
                <h2>Transaction Ledger (FIFO Sales Cost)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Product ID</th>
                            <th>Qty</th>
                            <th>Cost (₹)</th>
                            <th>Oldest Batch Info</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...sortedSales, ...sortedPurchases].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(tx => {
                            const isSale = !!tx.total_cost;
                            const isRecent = lastEvent && tx.product_id === lastEvent.product_id;

                            const batches = isSale && batchMap[tx.id] ? batchMap[tx.id] : [];

                            return (
                                <tr key={`${isSale ? 's' : 'p'}-${tx.id}`} style={{ backgroundColor: isRecent ? '#f0fdf4' : 'transparent' }}>
                                    <td>{isSale ? 'Sale' : 'Purchase'}</td>
                                    <td>{tx.product_id}</td>
                                    <td>{tx.quantity}</td>
                                    <td>{isSale ? tx.total_cost : tx.unit_price}</td>
                                    <td>
                                        {isSale ? (
                                            <div>
                                                <ul style={{ margin: 0, paddingLeft: 15 }}>
                                                    {batches.map((b, idx) => (
                                                        <li key={idx}>
                                                            ₹{b.unit_price} @ {new Date(b.batch_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : 'Purchase'}
                                    </td>
                                    <td>{new Date(tx.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>


            <div style={{ marginTop: '2rem' }}>
                <h2>Sales vs Purchases Chart</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={Object.keys(productStats).map(pid => ({
                            product_id: pid,
                            Sales: productStats[pid].salesQty,
                            Purchases: productStats[pid].purchaseQty
                        }))}
                        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="product_id" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Sales" fill="#f87171" />
                        <Bar dataKey="Purchases" fill="#4ade80" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="button-row" style={{ marginTop: '2rem' }}>
                <button onClick={simulate}>Simulate Random Transaction</button>
                <button onClick={fetchAll}>Refresh Data</button>
            </div>
        </div>
    );
}
