"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [quantity, setQuantity] = useState('1');
    const [barcode, setBarcode] = useState('');
    const [product, setProduct] = useState('');
    const [price, setPrice] = useState('');
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [cashTendered, setCashTendered] = useState('');
    const [change, setChange] = useState('');
    const [fullname, setFullname] = useState('');
    const [role, setRole] = useState('');
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        fullname: '',
        role: 'user'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setFullname(storedName);
        }

        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }

        // fetchUsers();
        fetchTransactions();
    }, []);

    const fetchProductDetails = async (barcode) => {
        try {
            const response = await axios.get('http://localhost/listing/sampleData.php');
            const data = response.data;
            const productDetail = data.find(product => product.barcode === barcode);
            if (productDetail) {
                setProduct(productDetail.p_name);
                setPrice(productDetail.price);
            } else {
                setProduct('');
                setPrice('');
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    const addItem = () => {
        if (quantity && product && price) {
            const newItem = {
                quantity: parseFloat(quantity),
                product,
                price: parseFloat(price),
                amount: parseFloat(quantity) * parseFloat(price)
            };
            setItems([...items, newItem]);
            setTotal(total + newItem.amount);
            setQuantity('');
            setBarcode('');
            setProduct('');
            setPrice('');
        } else {
            alert('Invalid barcode');
        }
    };

    const calculateChange = () => {
        const tendered = parseFloat(cashTendered);
        if (tendered < total) {
            alert('Insufficient cash. Please provide more money.');
            setChange('');
        } else {
            setChange(tendered - total);
        }
    };

    

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <div className="w-full max-w-5xl bg-green-400 shadow-lg rounded-lg flex flex-col">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 p-8 flex flex-col items-center">
                        <form onSubmit={(e) => { e.preventDefault(); addItem(); }} className="w-full">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="mb-4">
                                    <label htmlFor="quantity" className="block text-gray-700 font-bold mb-2">Quantity:</label>
                                    <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="border text-black rounded-md px-3 py-2 w-full" required />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="barcode" className="block text-gray-700 font-bold mb-2">Barcode:</label>
                                    <input type="text" id="barcode" value={barcode} onChange={(e) => { setBarcode(e.target.value); fetchProductDetails(e.target.value); }} className="border text-black rounded-md px-3 py-2 w-full" required />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="md:w-1/2 p-8 flex flex-col justify-between">
                        <div className="mb-4 flex justify-center">
                            <h2 className="text-3xl text-white font-bold">Hello {fullname}</h2>
                        </div>
                        <div className="mb-4 flex justify-end">
                            <h3 className="text-2xl text-black font-bold">Amount Due: {total.toFixed(2)}</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border text-black border-gray-200 shadow-md rounded-md">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="px-4 py-2 text-sm">{item.quantity}</td>
                                            <td className="px-4 py-2 text-sm">{item.product}</td>
                                            <td className="px-4 py-2 text-sm">{item.price.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-sm">{item.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-end mb-4">
                                <div className="flex items-center">
                                    <label htmlFor="cashTendered" className="text-gray-700 font-bold mr-4 flex-shrink-0">Cash:</label>
                                    <input
                                        type="number"
                                        id="cashTendered"
                                        value={cashTendered}
                                        onChange={(e) => setCashTendered(e.target.value)}
                                        className="border text-black rounded-md px-3 py-2 w-32"
                                        required
                                    />
                                </div>
                            </div>
                            {change !== '' && (
                                <div className="mt-4 flex justify-end">
                                    <h3 className="text-xl text-black font-bold">Change: {change.toFixed(2)}</h3>
                                </div>
                            )}

                            <button onClick={calculateChange} className="bg-yellow-500 hover:bg-green-600 text-black py-2 px-4 rounded-md flex justify-center">
                                Compute
                            </button>
                        </div>
                    </div>
                </div>

                {role === 'admin' && (
                    <div className="p-8 bg-blue-200 rounded-lg mt-4">
                        <h2 className="text-2xl font-bold text-center mb-4">Admin Features</h2>
                        {/* Add User Section */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold">Add User</h3>
                            <form onSubmit={handleAddUser}>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username:</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={newUser.username}
                                            onChange={handleInputChange}
                                            className="border text-black rounded-md px-3 py-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={newUser.password}
                                            onChange={handleInputChange}
                                            className="border text-black rounded-md px-3 py-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="fullname" className="block text-gray-700 font-bold mb-2">Full Name:</label>
                                        <input
                                            type="text"
                                            id="fullname"
                                            name="fullname"
                                            value={newUser.fullname}
                                            onChange={handleInputChange}
                                            className="border text-black rounded-md px-3 py-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="role" className="block text-gray-700 font-bold mb-2">Role:</label>
                                        <select
                                            id="role"
                                            name="role"
                                            value={newUser.role}
                                            onChange={handleInputChange}
                                            className="border text-black rounded-md px-3 py-2 w-full"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">
                                        Add User
                                    </button>
                                </div>
                            </form>
                        </div>


                        <div>
                            <h3 className="text-xl font-bold">View Transactions</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border text-black border-gray-200 shadow-md rounded-md">
                                    <thead className="bg-gray-100 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                <td className="px-4 py-2 text-sm">{transaction.username}</td>
                                                <td className="px-4 py-2 text-sm">{transaction.product}</td>
                                                <td className="px-4 py-2 text-sm">{transaction.quantity}</td>
                                                <td className="px-4 py-2 text-sm">{transaction.price}</td>
                                                <td className="px-4 py-2 text-sm">{transaction.total}</td>
                                                <td className="px-4 py-2 text-sm">{transaction.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
