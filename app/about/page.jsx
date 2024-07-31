"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Col, Row } from 'react-bootstrap';

const About = () => {
    const pathname = usePathname();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [occupation, setOccupation] = useState('');
    const [address, setAddress] = useState('');
    const [birthday, setBirthday] = useState('');
    const [bioData, setBioData] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);
    const [deletedData, setDeletedData] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation for age
        if (!/^\d+$/.test(age)) {
            alert('Age must be a number.');
            return;
        }

        // Check if the information already exists
        const exists = bioData.some(
            (data) => data.name === name && data.age === age && data.occupation === occupation && data.address === address && data.birthday === birthday
        );
        if (exists) {
            alert('This information already exists.');
            return;
        }

        if (editIndex === -1) {
            const newData = { name, age, occupation, address, birthday };
            setBioData([...bioData, newData]);
        } else {
            const updatedData = [...bioData];
            updatedData[editIndex] = { name, age, occupation, address, birthday };
            setBioData(updatedData);
            setEditIndex(-1);
        }
        setName('');
        setAge('');
        setOccupation('');
        setAddress('');
        setBirthday('');
    };

    const handleEdit = (index) => {
        const editItem = bioData[index];
        setName(editItem.name);
        setAge(editItem.age);
        setOccupation(editItem.occupation);
        setAddress(editItem.address);
        setBirthday(editItem.birthday);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        const deletedItem = bioData[index];
        const updatedData = [...bioData];
        updatedData.splice(index, 1);
        setBioData(updatedData);
        setDeletedData([...deletedData, deletedItem]);
    };

    const handleRestore = (index) => {
        const restoredItem = deletedData[index];
        const updatedDeletedData = [...deletedData];
        updatedDeletedData.splice(index, 1);
        setDeletedData(updatedDeletedData);
        setBioData([...bioData, restoredItem]);
    };

    const handleClearDeleted = () => {
        setDeletedData([]);
    };

    const handleCancel = () => {
        setName('');
        setAge('');
        setOccupation('');
        setAddress('');
        setBirthday('');
        setEditIndex(-1);
    };

    return (
        <>
            <nav className="bg-gray-800 p-5 fixed w-full z-10">
                <div className="max-w-full mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-white text-xl font-bold">Sir Pitok Store</h1>
                    </div>

                    <div className="space-x-4 flex">
                        <Link href="/" className={`text-gray-300 hover:bg-gray-700 p-2 rounded-md ${pathname === '/' ? 'text-blue-500' : ''}`}>
                            <i className={`bi bi-house-fill text-2xl ${pathname === '/' ? 'fill-current' : ''}`}></i>
                        </Link>
                        <Link href="/about" className={`text-gray-300 hover:bg-gray-700 p-2 rounded-md ${pathname === '/about' ? 'text-blue-500' : ''}`}>
                            <i className={`bi bi-file-person text-2xl ${pathname === '/about' ? 'fill-current' : ''}`}></i>
                        </Link>
                        <Link href="/contactus" className={`text-gray-300 hover:bg-gray-700 p-2 rounded-md ${pathname === '/contactus' ? 'text-blue-500' : ''}`}>
                            <i className={`bi bi-person-lines-fill text-2xl ${pathname === '/contactus' ? 'fill-current' : ''}`}></i>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="max-w-3xl p-2 bg-white shadow-lg rounded-lg overflow-y-auto mt-20" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                    <h2 className="text-2xl text-black font-bold mb-4">BIODATA</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="mb-4">
                                <label htmlFor="name1" className="block text-gray-700 font-bold mb-2">Name:</label>
                                <input type="text" id="name1" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 text-black rounded-md px-3 py-2 w-full" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="age" className="block text-gray-700 font-bold mb-2">Age:</label>
                                <input type="text" id="age" value={age} onChange={(e) => setAge(e.target.value)} className="border border-gray-300 text-black rounded-md px-3 py-2 w-full" required pattern="\d+" title="Please enter a valid number" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="occupation" className="block text-gray-700 font-bold mb-2">Occupation:</label>
                                <input type="text" id="occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} className="border border-gray-300 text-black rounded-md px-3 py-2 w-full" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-gray-700 font-bold mb-2">Address:</label>
                                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="border border-gray-300 text-black rounded-md px-3 py-2 w-full" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="birthday" className="block text-gray-700 font-bold mb-2">Birthday:</label>
                                <input type="date" id="birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="form-control border border-gray-300 text-black rounded-md px-3 py-2 w-full" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="col-span-1 sm:col-span-3 flex justify-end sm:justify-end">
                                <button type="submit" className={`bg-${editIndex === -1 ? 'blue' : 'green'} bg-blue-500 hover:bg-${editIndex === -1 ? 'blue' : 'green'}-600 text-white py-2 px-4 rounded-md`}>
                                    {editIndex === -1 ? 'Submit' : 'Update'}
                                </button>
                                {editIndex !== -1 && (
                                    <button type="button" className="ml-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>

                    {bioData.length > 0 && (
                        <div className="mt-8 overflow-x-auto">
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border text-black border-gray-200 shadow-md rounded-md">
                                    <thead className="bg-gray-100 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birthday</th>

                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bioData.map((data, index) => (
                                            data && (
                                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                    <td className="px-4 py-2 text-sm">{data.name}</td>
                                                    <td className="px-4 py-2 text-sm">{data.age}</td>
                                                    <td className="px-4 py-2 text-sm">{data.occupation}</td>
                                                    <td className="px-4 py-2 text-sm">{data.address}</td>
                                                    <td className="px-4 py-2 text-sm">{data.birthday}</td>

                                                    <td className="px-4 py-2 text-center">
                                                        <button type="button" className="text-blue-500 hover:text-blue-700 mr-2" onClick={() => handleEdit(index)}>Edit</button>
                                                        <button type="button" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(index)}>Delete</button>
                                                    </td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {deletedData.length > 0 && (
                        <div className="mt-8 overflow-x-auto">
                            <h3 className="text-xl font-bold mb-2">Deleted Items</h3>
                            <div className="flex justify-end mb-4">
                                <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md" onClick={handleClearDeleted}>
                                    Clear All
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border text-black border-gray-200 shadow-md rounded-md">
                                    <thead className="bg-gray-100 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birthday</th>

                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deletedData.map((data, index) => (
                                            data && (
                                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                    <td className="px-4 py-2 text-sm">{data.name}</td>
                                                    <td className="px-4 py-2 text-sm">{data.age}</td>
                                                    <td className="px-4 py-2 text-sm">{data.occupation}</td>
                                                    <td className="px-4 py-2 text-sm">{data.address}</td>
                                                    <td className="px-4 py-2 text-sm">{data.birthday}</td>
                                                    <td className="px-4 py-2 text-center">
                                                        <button type="button" className="text-green-500 hover:text-green-700 mr-2" onClick={() => handleRestore(index)}>Restore</button>
                                                    </td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default About;
