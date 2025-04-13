import React, { useEffect, useState } from "react";
import ApiCall from "../config";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminSemester() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the semester ID from the URL
    const [semester, setSemester] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        counts: [
            {
                semester: 1, // Ensure semester is included
                maruzaCount: 0,
                seminarCount: 0,
                amaliyCount: 0,
                labaratoriyaCount: 0,
            },
        ],
    });

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await ApiCall(`/api/v1/subject`, "GET");
            setSubjects(response.data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedCounts = [...formData.counts];
        updatedCounts[index][name] = parseInt(value, 10);
        setFormData({ ...formData, counts: updatedCounts });
    };

    const handleAddSubject = async () => {
        try {
            const payload = {
                name: formData.name,
                semesterCounts: formData.counts.map((count) => ({
                    semester: count.semester,
                    maruzaCount: count.maruzaCount,
                    seminarCount: count.seminarCount,
                    amaliyCount: count.amaliyCount,
                    labaratoriyaCount: count.labaratoriyaCount,
                })),
            };
            await ApiCall("/api/v1/subject", "POST", payload, null, true);
            fetchSubjects();
            setIsAddModalVisible(false);
            setFormData({
                name: "",
                counts: [
                    {
                        semester: 1,
                        maruzaCount: 0,
                        seminarCount: 0,
                        amaliyCount: 0,
                        labaratoriyaCount: 0,
                    },
                ],
            });
        } catch (error) {
            console.error("Error adding subject:", error);
        }
    };

    const handleEditSubject = async () => {
        try {
            const payload = {
                name: formData.name,
                semesterCounts: formData.counts.map((count) => ({
                    semester: count.semester,
                    maruzaCount: count.maruzaCount,
                    seminarCount: count.seminarCount,
                    amaliyCount: count.amaliyCount,
                    labaratoriyaCount: count.labaratoriyaCount,
                })),
            };
            await ApiCall(`/api/v1/subject/${selectedSubject.id}`, "PUT", payload, null, true);
            fetchSubjects();
            setIsEditModalVisible(false);
            setFormData({
                name: "",
                counts: [
                    {
                        semester: 1,
                        maruzaCount: 0,
                        seminarCount: 0,
                        amaliyCount: 0,
                        labaratoriyaCount: 0,
                    },
                ],
            });
        } catch (error) {
            console.error("Error updating subject:", error);
        }
    };

    const handleDeleteSubject = async (subjectId) => {
        try {
            await ApiCall(`/api/v1/subject/${subjectId}`, "DELETE", null, null, true);
            fetchSubjects();
        } catch (error) {
            console.error("Error deleting subject:", error);
        }
    };

    const openAddModal = () => {
        setFormData({
            name: "",
            counts: [
                {
                    semester: 1,
                    maruzaCount: 0,
                    seminarCount: 0,
                    amaliyCount: 0,
                    labaratoriyaCount: 0,
                },
            ],
        });
        setIsAddModalVisible(true);
    };

    const openEditModal = (subject) => {
        setSelectedSubject(subject);
        setFormData({
            name: subject.name,
            counts: subject.semesterCounts || [
                {
                    semester: 1,
                    maruzaCount: 0,
                    seminarCount: 0,
                    amaliyCount: 0,
                    labaratoriyaCount: 0,
                },
            ],
        });
        setIsEditModalVisible(true);
    };

    const addNewCountRow = () => {
        setFormData({
            ...formData,
            counts: [
                ...formData.counts,
                {
                    semester: formData.counts.length + 1, // Increment semester number
                    maruzaCount: 0,
                    seminarCount: 0,
                    amaliyCount: 0,
                    labaratoriyaCount: 0,
                },
            ],
        });
    };

    const removeCountRow = (index) => {
        const updatedCounts = formData.counts.filter((_, i) => i !== index);
        setFormData({ ...formData, counts: updatedCounts });
    };

    return (
        <div>
            <Sidebar />
            <div className="p-6 pl-72 bg-gray-100 min-h-screen">
                <div className={"flex flex-wrap justify-between"}>
                    <h1 className="text-2xl font-bold mb-6">
                       Fanlar ro'yxati
                    </h1>
                    <button
                        onClick={openAddModal}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-6 hover:bg-blue-600"
                    >
                        Fan qo'shish
                    </button>
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Fan nomi</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Soati</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">O'quv dasturi(.pdf)</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">O'quv dasturi(word)</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Sillabus(.pdf)</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Sillabus(word)</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Namunaviy dastur</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {subjects.map((subject, index) => (
                            <tr key={subject.id} className="border-b border-gray-300">
                                <td className="px-3 py-1 text-sm text-gray-900 border border-gray-300">{index + 1}</td>
                                <td onClick={() => navigate("/dashboard/subject/" + subject.id)} className="px-3 py-1 text-sm text-blue-500 border border-gray-300">
                                    {subject.name}
                                </td>
                                <td className="px-3 py-1 text-sm text-gray-900 border border-gray-300">
                                    <div>
                                        <p className="p-0 m-0">
                                            {subject.semesterCounts.map((count, index) => (
                                                <>
                                                 {/*<span key={index} className="bg-green-400 rounded-xl px-2 mx-1">*/}
                                                 <span key={index} className="bg-red-400 rounded-xl px-2 mx-1 text-white">
                                                    {count.maruzaCount > 0 && `Maruza-[${count.maruzaCount}-0] `}
                                                     {count.seminarCount > 0 && `Seminar-[${count.seminarCount}-0] `}
                                                     {count.amaliyCount > 0 && `Amaliy-[${count.amaliyCount}-0] `}
                                                     {count.labaratoriyaCount > 0 && `Labaratoriya-[${count.labaratoriyaCount}-0]`}
                                                </span>

                                                </>


                                            ))}
                                        </p>
                                    </div>
                                </td>

                                <td className="px-3 py-1 text-sm text-gray-900 border border-gray-300">
                                    {subject.oquvDasturiPdf === null ? <p className={"text-red-500 p-1 rounded"}>Mavjud emas</p> : "Mavjud"}
                                </td>
                                <td className="px-3 py-1 text-sm text-gray-900 border border-gray-300">
                                    {subject.oquvDasturiWord === null ? <p className={"text-red-500 p-1 rounded"}>Mavjud emas</p> : "Mavjud"}
                                </td>
                                <td className="px-3 py-1 text-sm text-gray-900 border border-gray-300">
                                    {subject.sillabusPdf === null ? <p className={"text-red-500 p-1 rounded"}>Mavjud emas</p> : "Mavjud"}
                                </td>
                                <td className="px-3 py-1 text-sm text-gray-900 border border-gray-300">
                                    {subject.sillabusWord === null ? <p className={"text-red-500 p-1 rounded"}>Mavjud emas</p> : "Mavjud"}
                                </td>
                                <td className="px-3 py-1 text-sm text-gray-900 border border-gray-300">
                                    {subject.namunaviyDastur === null ? <p className={"text-red-500 p-1 rounded"}>Mavjud emas</p> : "Mavjud"}
                                </td>
                                <td className="px-3 py-1 text-sm text-gray-900 border border-gray-300">

                                    <button
                                        onClick={() => handleDeleteSubject(subject.id)}
                                        className="text-white hover:text-red-700 bg-red-500 p-2 rounded-xl"
                                    >
                                        O'chirish
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <Rodal width={500} height={600} visible={isAddModalVisible} onClose={() => setIsAddModalVisible(false)}>
                    <h2 className="text-xl font-bold mb-4">Yangi fan qo'shish</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Fan nomi</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        {formData.counts.map((count, index) => (
                            <div key={index} className="mb-4 flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Maruzalar soni</label>
                                    <input
                                        type="number"
                                        name="maruzaCount"
                                        value={count.maruzaCount}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Seminarlar soni</label>
                                    <input
                                        type="number"
                                        name="seminarCount"
                                        value={count.seminarCount}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Amaliylar soni</label>
                                    <input
                                        type="number"
                                        name="amaliyCount"
                                        value={count.amaliyCount}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Labaratoriyalar soni</label>
                                    <input
                                        type="number"
                                        name="labaratoriyaCount"
                                        value={count.labaratoriyaCount}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => removeCountRow(index)}
                                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                                >
                                    x
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addNewCountRow}
                            className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-600"
                        >
                            + Qo'shish
                        </button>
                        <button
                            type="button"
                            onClick={handleAddSubject}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Saqlash
                        </button>
                    </form>
                </Rodal>

                {/* Edit Subject Modal */}
                <Rodal width={500} height={600} visible={isEditModalVisible} onClose={() => setIsEditModalVisible(false)}>
                    <h2 className="text-xl font-bold mb-4">Tahrirlash</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Fan nomi</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        {formData.counts.map((count, index) => (
                            <div key={index} className="mb-4 flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Maruzalar soni</label>
                                    <input
                                        type="number"
                                        name="maruzaCount"
                                        value={count.maruzaCount}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Seminarlar soni</label>
                                    <input
                                        type="number"
                                        name="seminarCount"
                                        value={count.seminarCount}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Amaliylar soni</label>
                                    <input
                                        type="number"
                                        name="amaliyCount"
                                        value={count.amaliyCount}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Labaratoriyalar soni</label>
                                    <input
                                        type="number"
                                        name="labaratoriyaCount"
                                        value={count.labaratoriyaCount}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => removeCountRow(index)}
                                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                                >
                                    x
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addNewCountRow}
                            className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-600"
                        >
                            + Qo'shish
                        </button>
                        <button
                            type="button"
                            onClick={handleEditSubject}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Update
                        </button>
                    </form>
                </Rodal>
            </div>
        </div>
    );
}

export default AdminSemester;