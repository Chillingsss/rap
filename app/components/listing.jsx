// components/Listing.js
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Listing = () => {
    const [data, setData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    useEffect(() => {
        axios.get('http://localhost/listing/sampleData.php')
            .then(response => {
                console.log('Data fetched:', response.data);
                setData(response.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const sortedData = [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-4xl px-4 py-8">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
                        <thead className="bg-gray-200">
                            <tr>
                                <th
                                    className="px-4 py-2 text-left text-sm font-semibold text-gray-600 tracking-wider cursor-pointer hover:text-blue-600 border-r border-gray-300"
                                    onClick={() => requestSort('name')}
                                >
                                    Name
                                    {sortConfig.key === 'name' && (sortConfig.direction === 'ascending')}
                                </th>
                                <th
                                    className="px-4 py-2 text-left text-sm font-semibold text-gray-600 tracking-wider cursor-pointer hover:text-blue-600 border-r border-gray-300"
                                    onClick={() => requestSort('age')}
                                >
                                    Age
                                    {sortConfig.key === 'age' && (sortConfig.direction === 'ascending')}
                                </th>
                                <th
                                    className="px-4 py-2 text-left text-sm font-semibold text-gray-600 tracking-wider cursor-pointer hover:text-blue-600 border-r border-gray-300"
                                    onClick={() => requestSort('occupation')}
                                >
                                    Occupation
                                    {sortConfig.key === 'occupation' && (sortConfig.direction === 'ascending')}
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 tracking-wider border-r border-gray-300">
                                    Address
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 tracking-wider">
                                    Birthday
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((item, index) => (
                                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50 border-b border-gray-200' : 'bg-white border-b border-gray-200'}>
                                    <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-300">{item.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-300">{item.age}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-300">{item.occupation}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-300">{item.address}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{item.birthday}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Listing;
