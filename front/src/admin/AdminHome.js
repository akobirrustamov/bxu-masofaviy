import React, { useEffect, useState } from "react";
import ApiCall from "../config";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import {useNavigate} from "react-router-dom";
import AdminSemester from "./AdminSemester";
import Sidebar from "./Sidebar";

function AdminHome() {
    const navigate=useNavigate();
    const [directions, setDirections] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedDirection, setSelectedDirection] = useState(null);
    const [formData, setFormData] = useState({ name: "", year: "", status: 1 });

    useEffect(() => {
        fetchDirections();
    }, []);

    const fetchDirections = async () => {
        try {
            const response = await ApiCall("/api/v1/direction", "GET", null, null, true);
            setDirections(response.data);
        } catch (error) {
            console.error("Error fetching directions:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddDirection = async () => {
        try {
            await ApiCall("/api/v1/direction", "POST", formData, null, true);
            fetchDirections();
            setIsAddModalVisible(false);
            setFormData({ name: "", year: "", status: 1 });
        } catch (error) {
            console.error("Error adding direction:", error);
        }
    };

    const handleEditDirection = async () => {
        try {
            await ApiCall(`/api/v1/direction/${selectedDirection.id}`, "PUT", formData, null, true);
            fetchDirections();
            setIsEditModalVisible(false);
            setFormData({ name: "", year: "", status: 1 });
        } catch (error) {
            console.error("Error updating direction:", error);
        }
    };

    const handleDeleteDirection = async () => {
        try {
            await ApiCall(`/api/v1/direction/${selectedDirection.id}`, "DELETE", null, null, true);
            fetchDirections();
            setIsDeleteModalVisible(false);
        } catch (error) {
            console.error("Error deleting direction:", error);
        }
    };

    const openAddModal = () => {
        setFormData({ name: "", year: "", status: 1 });
        setIsAddModalVisible(true);
    };

    const openEditModal = (direction) => {
        setSelectedDirection(direction);
        setFormData({ name: direction.name, year: direction.year, status: direction.status });
        setIsEditModalVisible(true);
    };

    const openDeleteModal = (direction) => {
        setSelectedDirection(direction);
        setIsDeleteModalVisible(true);
    };

    return (
        <div>
            <Sidebar/>
            <div className="p-6 pl-72 bg-gray-100 min-h-screen">
                <div className={"flex flex-wrap justify-between"}>
                    <h1 className="text-2xl font-bold mb-6">Yo'nalishlar</h1>

                    <button
                        onClick={openAddModal}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-6 hover:bg-blue-600"
                    >
                        Yangi yo'nalish qo'shish
                    </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Yo'nalish nomi</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">o'quv yili </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {directions.map((direction, index) => (
                            <tr key={direction.id} className="border-b">
                                <td className="px-6 py-2 text-sm text-gray-900">{index+1}</td>
                                <td
                                    onClick={()=>navigate("/dashboard/direction/"+direction.id)}
                                    className="px-6 py-2 text-sm text-blue-500">{direction.name}</td>
                                <td className="px-6 py-2 text-sm text-gray-900">{direction.year}-{direction.year+4}</td>

                                <td className="px-6 py-2 text-sm text-gray-900">
                                    <button
                                        onClick={() => openEditModal(direction)}
                                        className="text-white hover:text-blue-700 mr-4 bg-green-500 p-2 rounded-xl "
                                    >
                                        Tahrirlash
                                    </button>
                                    {/*<button*/}
                                    {/*    onClick={() => openDeleteModal(direction)}*/}
                                    {/*    className="text-white hover:text-red-700 bg-red-500 p-2 rounded-xl"*/}
                                    {/*>*/}
                                    {/*    O'chirish*/}
                                    {/*</button>*/}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Add Direction Modal */}
                <Rodal width={400} height={400} visible={isAddModalVisible} onClose={() => setIsAddModalVisible(false)}>
                    <h2 className="text-xl font-bold mb-4">Yo'nalish qo'shish</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Yo'nalish nomi</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">O'quv yili boshlanishi</label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAddDirection}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Saqlash
                        </button>
                    </form>
                </Rodal>

                {/* Edit Direction Modal */}
                <Rodal width={400} height={400} visible={isEditModalVisible} onClose={() => setIsEditModalVisible(false)}>
                    <h2 className="text-xl font-bold mb-4">Tahrirlash</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Yo'nalish nomi</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">O'quv yili boshlanishi</label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleEditDirection}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Yangilash
                        </button>
                    </form>
                </Rodal>

                {/* Delete Confirmation Modal */}
                <Rodal visible={isDeleteModalVisible} onClose={() => setIsDeleteModalVisible(false)}>
                    <h2 className="text-xl font-bold mb-4">Yo'nalishni ochirish</h2>
                    <p className="mb-4">Are you sure you want to delete this direction?</p>
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsDeleteModalVisible(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteDirection}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </Rodal>

            </div>
        </div>

    );
}

export default AdminHome;