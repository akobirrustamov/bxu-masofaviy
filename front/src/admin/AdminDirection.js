import React, { useEffect, useState } from "react";
import ApiCall from "../config";
import { useNavigate, useParams } from "react-router-dom";

function AdminDirection() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the direction ID from the URL
    const [semesters, setSemesters] = useState([]);
    const [direction, setDirection] = useState(null);

    useEffect(() => {
        fetchDirectionAndSemesters();

    }, [id]);

    const fetchDirectionAndSemesters = async () => {
        try {
            // Fetch direction details
            const directionResponse = await ApiCall(`/api/v1/direction/${id}`, "GET");
            setDirection(directionResponse.data);

            // Fetch semesters for the direction
            const semestersResponse = await ApiCall(`/api/v1/direction/${id}/semesters`, "GET");
            setSemesters(semestersResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div>
            <div className="p-6 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold mb-6">Yo'nalish: {direction?.name}</h1>
                <div className={"flex flex-wrap px-6 p-2 items-baseline"}>
                    <p onClick={() => navigate("/dashboard")} className={"text-sm text-blue-500 cursor-pointer"}>
                        Yo'nalishlar
                    </p>
                    <p className={"text-sm"}> / {direction?.name} yo'nalishi semestrlari</p>
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Semestr Nomi</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">O'quv Yili</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Yaratilgan Sana</th>
                        </tr>
                        </thead>
                        <tbody>
                        {semesters.map((semester, index) => (
                            <tr
                                key={semester.id}
                                className="border-b hover:bg-gray-50 cursor-pointer "
                                onClick={() => navigate(`/dashboard/semester/${semester.id}`)} // Navigate to semester page
                            >
                                <td className="px-3 py-2 text-sm text-gray-900">{index + 1}</td>
                                <td className="px-3 py-2 text-sm text-blue-500">{semester.name}</td>
                                <td className="px-3 py-2 text-sm text-gray-900">{semester.educationYear}</td>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                    {new Date(semester.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>


                <div>

                </div>
            </div>
        </div>
    );
}

export default AdminDirection;