"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [usernames, setUsernames] = useState([]);
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

    const [showVoidModal, setShowVoidModal] = useState(false);
    const [itemToVoid, setItemToVoid] = useState(null);
    const [adminPassword, setAdminPassword] = useState('');

    const router = useRouter();

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setFullname(storedName);
        }

        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }

        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost/listing/sampleData.php', {
            params: { type: 'users' }
        })
            .then(response => {
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                    const usernames = response.data.map(user => user.username);
                    setUsernames(usernames);
                } else {
                    console.error('Response data is not an array:', response.data);
                }
            })
            .catch(error => console.error('Error fetching users:', error));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            setIsLoggedIn(true);
            localStorage.setItem('name', user.fullname);
            localStorage.setItem('role', user.role);
            setFullname(user.fullname);
            setRole(user.role);
        } else {
            alert('Invalid username or password');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
        setFullname('');
        setRole('');
        localStorage.removeItem('name');
        localStorage.removeItem('role');
    };

    const fetchProductDetails = async (barcode) => {
        try {
            const response = await axios.get('http://localhost/listing/sampleData.php', {
                params: { type: 'products' }
            });
            const data = response.data;
            const productDetail = data.find(product => product.barcode === barcode);
            if (productDetail) {
                setProduct(productDetail.p_name);
                setPrice(productDetail.price);
                addItem(productDetail.p_name, productDetail.price);
            } else {
                setProduct('');
                setPrice('');
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
            alert('Error fetching product data.');
        }
    };

    const addItem = (productName, productPrice) => {
        if (quantity && productName && productPrice) {
            const parsedQuantity = parseFloat(quantity);
            const parsedPrice = parseFloat(productPrice);

            setItems(prevItems => {
                const existingItemIndex = prevItems.findIndex(item => item.product === productName);

                if (existingItemIndex !== -1) {
                    const updatedItems = prevItems.map((item, index) =>
                        index === existingItemIndex
                            ? {
                                ...item,
                                quantity: item.quantity + parsedQuantity,
                                amount: (item.quantity + parsedQuantity) * parsedPrice // Update the amount calculation
                            }
                            : item
                    );

                    // Calculate the new total
                    const newTotal = updatedItems.reduce((acc, item) => acc + item.amount, 0);
                    setTotal(newTotal);

                    return updatedItems;
                } else {
                    const newItem = {
                        quantity: parsedQuantity,
                        product: productName,
                        price: parsedPrice,
                        amount: parsedQuantity * parsedPrice // Correctly calculate the amount
                    };
                    const newItems = [...prevItems, newItem];

                    // Calculate the new total
                    const newTotal = newItems.reduce((acc, item) => acc + item.amount, 0);
                    setTotal(newTotal);

                    return newItems;
                }
            });

            // Reset input fields
            setQuantity('1');
            setBarcode('');
            setProduct('');
            setPrice('');
        } else {
            alert('Invalid barcode');
        }
    };




    const calculateChange = (cashAmount) => {
        const tendered = parseFloat(cashAmount);
        if (tendered < total) {
            // alert('Insufficient cash. Please provide more money.');
            setChange('');
        } else {
            setChange(tendered - total);
        }
    };

    useEffect(() => {
        if (barcode) {
            fetchProductDetails(barcode);
        }
    }, [barcode]);

    useEffect(() => {
        if (cashTendered) {
            calculateChange(cashTendered);
        }
    }, [cashTendered]);

    const handleVoidItem = (item) => {
        if (role === 'admin') {
            setItemToVoid(item);
            setShowVoidModal(true);
        } else {
            setItemToVoid(item);
            setShowVoidModal(true);
        }
    };

    const handleVoidSubmit = async (e) => {
        e.preventDefault();

        try {
            const usersResponse = await axios.get('http://localhost/listing/sampleData.php?type=users');
            const users = usersResponse.data;

            const isValid = users.some(user => user.role === 'admin' && user.password === adminPassword);

            if (isValid) {
                setItems(prevItems => prevItems.filter(item => item !== itemToVoid));
                setTotal(prevTotal => prevTotal - itemToVoid.amount);
                setShowVoidModal(false);
                setAdminPassword('');
                setItemToVoid(null);
            } else {
                alert('Invalid admin password.');
            }
        } catch (error) {
            console.error('Error fetching user data or verifying password:', error);
            alert('Error verifying admin password.');
        }
    };

    const increaseQuantity = (productName) => {
        setItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.product === productName
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                        amount: (item.quantity + 1) * item.price
                    }
                    : item
            );

            const newTotal = updatedItems.reduce((acc, item) => acc + item.amount, 0);
            setTotal(newTotal);
            return updatedItems;
        });
    };

    const decreaseQuantity = (productName) => {
        setItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.product === productName
                    ? {
                        ...item,
                        quantity: Math.max(item.quantity - 1, 1),
                        amount: Math.max(item.quantity - 1, 1) * item.price
                    }
                    : item
            );

            const newTotal = updatedItems.reduce((acc, item) => acc + item.amount, 0);
            setTotal(newTotal);
            return updatedItems;
        });
    };


    const handleSaveTransaction = () => {
        const savedTransactions = JSON.parse(localStorage.getItem('savedTransactions')) || [];
        const newTransaction = { items, total };
        savedTransactions.push(newTransaction);
        localStorage.setItem('savedTransactions', JSON.stringify(savedTransactions));
        resetTransaction();
    };

    const handleLoadTransaction = (index) => {


        if (items.length > 0) {
            alert("Please complete the current transaction before loading another.");
            return;
        }

        const savedTransactions = JSON.parse(localStorage.getItem('savedTransactions')) || [];
        const transactionToLoad = savedTransactions[index];
        if (transactionToLoad) {
            setItems(transactionToLoad.items);
            setTotal(transactionToLoad.total);


            savedTransactions.splice(index, 1);
            localStorage.setItem('savedTransactions', JSON.stringify(savedTransactions));

        }
    };


    // const handleRemoveTransaction = (index) => {
    //     const updatedTransactions = savedTransactions.filter((_, i) => i !== index);
    //     localStorage.setItem('savedTransactions', JSON.stringify(updatedTransactions));
    //     setSavedTransactions(updatedTransactions);
    // };

    const resetTransaction = () => {
        setItems([]);
        setTotal(0);
        setCashTendered('');
        setChange('');
    };


    const handlePaidTransaction = () => {
        // Parse the cash tendered amount
        const cash = parseFloat(cashTendered);

        // Check if cashTendered is valid and sufficient
        if (isNaN(cash) || cash < total) {
            alert('Cash tendered is not sufficient or invalid.');
            return; // Exit the function if validation fails
        }

        // Proceed if validation passes
        const paidTransactions = JSON.parse(localStorage.getItem('paidTransactions')) || [];
        const newTransaction = { items, total, cashTendered: cash, change };
        paidTransactions.push(newTransaction);
        localStorage.setItem('paidTransactions', JSON.stringify(paidTransactions));
        resetTransaction();
    };



    return (
        <>



            <div className="flex flex-col md:flex-row min-h-screen">
                {!isLoggedIn && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
                            <form onSubmit={handleLogin}>
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
                                    <select
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="border text-black rounded-md px-3 py-2 w-full"
                                        id="username"
                                        required
                                    >
                                        <option value="">Select Username</option>
                                        {usernames.map((user, index) => (
                                            <option key={index} value={user}>{user}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="border text-black rounded-md px-3 py-2 w-full"
                                        id="password"
                                        type="password"
                                        required
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isLoggedIn && (
                    <div className='flex flex-col md:flex-grow '>
                        <div className="bg-gray-900 text-white p-4 shadow-lg w-full md:w-64 md:fixed top-0 left-0 h-full flex flex-col">
                            <h2 className="text-3xl font-bold mb-6">POS System</h2>
                            <ul className="space-y-4">
                                <li className="text-lg font-semibold hover:text-gray-300">Dashboard</li>
                                <li className="text-lg font-semibold hover:text-gray-300">Sales</li>
                                <li className="text-lg font-semibold hover:text-gray-300">Inventory</li>
                                <li className="text-lg font-semibold hover:text-gray-300">Reports</li>
                            </ul>
                            <div className="mt-auto">
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>



                        <div className="flex-grow bg-gray-100 p-8 md:ml-64">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-black">Welcome, {fullname}</h2>
                            </div>
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md">
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="mb-4">
                                                <label htmlFor="quantity" className="block text-gray-700 font-bold mb-2">Quantity:</label>
                                                <input
                                                    type="number"
                                                    id="quantity"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                    className="border text-black rounded-md px-3 py-2 w-full"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="barcode" className="block text-gray-700 font-bold mb-2">Barcode:</label>
                                                <input
                                                    type="text"
                                                    id="barcode"
                                                    value={barcode}
                                                    onChange={(e) => setBarcode(e.target.value)}
                                                    className="border text-black rounded-md px-3 py-2 w-full"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md">
                                    <div className="mb-4 flex justify-between">
                                        <h3 className="text-2xl text-gray-700 font-bold">Current Sale</h3>
                                        <h3 className="text-2xl text-gray-700 font-bold">Total: ${total.toFixed(2)}</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white border text-black border-gray-200 shadow-md rounded-md">
                                            <thead className="bg-gray-100 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                        <td className="px-4 py-2 text-sm">
                                                            <button
                                                                onClick={() => decreaseQuantity(item.product)}
                                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                                                            >
                                                                -
                                                            </button>
                                                            {item.quantity}
                                                            <button
                                                                onClick={() => increaseQuantity(item.product)}
                                                                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                                                            >
                                                                +
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-2 text-sm">{item.product}</td>
                                                        <td className="px-4 py-2 text-sm">${item.price.toFixed(2)}</td>
                                                        <td className="px-4 py-2 text-sm">${item.amount.toFixed(2)}</td>
                                                        <td className="px-4 py-2 text-sm">
                                                            <button
                                                                onClick={() => handleVoidItem(item)}
                                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                                            >
                                                                Void
                                                            </button>
                                                        </td>
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
                                                <h3 className="text-xl text-gray-700 font-bold">Change: ${change.toFixed(2)}</h3>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex justify-between">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                            onClick={handleSaveTransaction}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                            onClick={handlePaidTransaction}
                                        >
                                            Paid
                                        </button>
                                    </div>

                                </div>
                            </div>


                            <div className="mb-4">
                                <h2 className="text-lg font-semibold">Load Transaction</h2>
                                <div className="space-y-2">
                                    {JSON.parse(localStorage.getItem('savedTransactions'))?.map((transaction, index) => {
                                        // Generate a summary of the transaction
                                        const itemDetails = transaction.items
                                            .map(item => `${item.quantity} x ${item.product}`)
                                            .join(', ');
                                        const summary = `${itemDetails} | Total: $${transaction.total.toFixed(2)}`;

                                        return (
                                            <button
                                                onClick={() => handleLoadTransaction(index)}
                                                className={`w-full sm:w-96 ml-0 sm:ml-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 ${items.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={items.length > 0}
                                            >
                                                Load Transaction {index + 1} - {summary}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>

            {showVoidModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4">Void Item</h2>
                        <form onSubmit={handleVoidSubmit}>
                            <p className="mb-4">Are you sure you want to void this item?</p>
                            <div className="mb-4">
                                <label htmlFor="adminPassword" className="block text-gray-700 mb-2">Admin Password</label>
                                <input
                                    type="password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    id="adminPassword"
                                    className="border text-black rounded-md px-3 py-2 w-full"
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Void</button>
                                <button
                                    type="button"
                                    onClick={() => setShowVoidModal(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;
