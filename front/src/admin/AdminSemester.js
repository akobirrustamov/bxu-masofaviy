import React, { useEffect, useState } from "react";
import ApiCall from "../config";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { useNavigate, useParams } from "react-router-dom";

function AdminSemester() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the semester ID from the URL
    const [semester, setSemester] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [relationships, setRelationships] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState("");

    useEffect(() => {
        fetchSubjects();
        fetchSemestr();
        fetchAllSubjects();
    }, [id]);

    const fetchAllSubjects = async () => {
        try {
            const response = await ApiCall(`/api/v1/subject`, "GET");
            setSubjects(response.data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await ApiCall(`/api/v1/relationship/${id}`, "GET");
            setRelationships(response.data);
        } catch (error) {
            console.error("Error fetching relationships:", error);
        }
    };

    const fetchSemestr = async () => {
        try {
            const response = await ApiCall(`/api/v1/semester/${id}`, "GET");
            setSemester(response.data);
        } catch (error) {
            console.error("Error fetching semester:", error);
        }
    };

    const handleAddSubject = async () => {
        if (!selectedSubjectId) {
            alert("Iltimos, fan tanlang!");
            return;
        }


        try {
            await ApiCall(`/api/v1/relationship/${id}`, "POST", {
                subjectId: selectedSubjectId,
                subject_semester: 0
            });

            setIsAddModalVisible(false);
            fetchSubjects(); // Jadvalni yangilash
        } catch (error) {
            console.error("Error adding relationship:", error);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex flex-wrap justify-between">
                <h1 className="text-2xl font-bold mb-6">
                    {semester?.direction?.name} yo'nalishi {semester?.name}
                </h1>

                <button
                    onClick={() => setIsAddModalVisible(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mb-6 hover:bg-blue-600"
                >
                    Fan qo'shish
                </button>
            </div>

            <div>
                <div className={"flex flex-wrap px-6 p-2 items-baseline"}>
                    <p onClick={() => navigate("/dashboard/")} className={"text-sm text-blue-500 cursor-pointer"}>
                        Yo'nalishlar
                    </p>
                    <p onClick={() => navigate("/dashboard/direction/"+semester.direction.id)} className={"text-sm text-blue-500 cursor-pointer"}> / {semester?.direction?.name} yo'nalishi semestrlari</p>
                    <p className={"text-sm"}>/{semester?.name}</p>
                </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full border border-gray-300">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">
                            Fan nomi
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Soati</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">O'quv dasturi</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Sillabus</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Namunaviy dastur</th>
                    </tr>
                    </thead>
                    <tbody>
                    {relationships.map((rel) => (
                        <tr key={rel.id}>
                            <td className="px-2 py-1 border border-gray-300">{rel.id}</td>
                            <td onClick={() => navigate("/dashboard/subject/" + rel.subject.id)}  className="px-3 py-1 text-sm text-blue-500 border border-gray-300">{rel.subject.name}</td>
                            <td className="px-2 py-1 border border-gray-300">
                                <p className="p-0 m-0">M/S/A/L</p>
                                {rel.subject.semesterCounts[rel.subjectSemester - 1] && (
                                    `${rel.subject.semesterCounts[rel.subjectSemester - 1].maruzaCount}/
                                     ${rel.subject.semesterCounts[rel.subjectSemester - 1].seminarCount}/
                                     ${rel.subject.semesterCounts[rel.subjectSemester - 1].amaliyCount}/
                                     ${rel.subject.semesterCounts[rel.subjectSemester - 1].labaratoriyaCount}`
                                )}
                            </td>


                            <td className="px-3 py-1 text-sm text-gray-900 border border-gray-300">
                                {rel.subject.oquvDasturi === null ? <p className={"text-red-500 p-1 rounded"}>Mavjud emas </p> : "yuklab olish"}
                            </td>
                            <td className="px-3 py-1 text-sm text-gray-900 border border-gray-300">
                                {rel.subject.sillabus === null ? <p className={"text-red-500 p-1 rounded"}>Mavjud emas</p> : "yuklab olish"}
                            </td>
                            <td className="px-3 py-1 text-sm text-gray-900 border border-gray-300">
                                {rel.subject.namunaviyDastur === null ? <p className={"text-red-500 p-1 rounded"}>Mavjud emas</p> : "yuklab olish"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Add Subject Modal */}
            <Rodal
                width={400}
                height={300}
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
            >
                <h2 className="text-xl font-bold mb-4">Yangi fan qo'shish</h2>
                <select
                    className="w-full p-2 mb-4 border rounded"
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                >
                    <option value="">Fanni tanlang</option>
                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleAddSubject}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                >
                    Saqlash
                </button>
            </Rodal>
        </div>
    );
}

export default AdminSemester;
