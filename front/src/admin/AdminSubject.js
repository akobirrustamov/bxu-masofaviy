import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import ApiCall, { baseUrl } from "../config";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
function AdminSubject(props) {

    const [isYoutubeModalVisible, setIsYoutubeModalVisible] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);


    const navigate = useNavigate();
    const { id } = useParams();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const [subject, setSubject] = useState({});
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        maruzaCount: 0,
        seminarCount: 0,
        amaliyCount: 0,
        labaratoriyaCount: 0,
    });
    const [formDataLesson, setFormDataLesson]=useState({
        id:null,
        name:"",
        youtubeIframeLink:""
    })

    useEffect(() => {
        fetchSubject();
        fetchLessons();
    }, [id]);

    const fetchSubject = async () => {
        try {
            const response = await ApiCall(`/api/v1/subject/${id}`, "GET");
            setSubject(response.data);
            setFormData({
                name: response.data.name,
                maruzaCount: response.data.maruzaCount || 0,
                seminarCount: response.data.seminarCount || 0,
                amaliyCount: response.data.amaliyCount || 0,
                labaratoriyaCount: response.data.labaratoriyaCount || 0,
            });
        } catch (error) {
            console.error("Error fetching subject:", error);
        }
    };

    const fetchLessons = async () => {
        try {
            const response = await ApiCall(`/api/v1/subject/${id}/lessons`, "GET");
            setLessons(response.data);
        } catch (error) {
            console.error("Error fetching lessons:", error);
        }
    };

    const uploadImage = async (image, prefix) => {
        const formData = new FormData();
        formData.append('photo', image);
        formData.append('prefix', prefix);

        try {
            const response = await ApiCall('/api/v1/file/upload', 'POST', formData, null, true);
            return response.data;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    };

    const handleFileUpload = async (file, type) => {
        if (!file) return;

        setLoading(true);
        try {
            const fileId = await uploadImage(file, type);
            const lastWord = type.split('/').pop();
            const response = await ApiCall(`/api/v1/subject/${id}/${lastWord}/${fileId}`, "PUT");
            setSubject(response.data);
        } catch (error) {
            console.error(`Error updating ${type}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubject = async (subjectId) => {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            try {
                await ApiCall(`/api/v1/subject/${subjectId}`, "DELETE");
                navigate("/subjects"); // Redirect to the subjects list after deletion
            } catch (error) {
                console.error("Error deleting subject:", error);
            }
        }
    };

    const handleDownload = async (id) => {


        try {
            const response = await fetch(`${baseUrl}/api/v1/file/getFile/${id.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf',
                },
            });
            if (!response.ok) {
                throw new Error("Failed to download file");
            }
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            const cleanFileName = id.name.substring(id.name.indexOf("_") + 1);

            link.download = cleanFileName; // Use the content-type to determine the file extension
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };




    const handleFileUploadLessonFile = async (url, file, type, lessonId) => {
        if (!file) return;

        setLoading(true);

        try {
            const fileId = await uploadImage(file, type);
            const response = await ApiCall(`/api/v1/lesson/${lessonId}/${url}/${fileId}`, "PUT");

            // Update the lessons state with the updated lesson data
            setLessons((prevLessons) =>
                prevLessons.map((lesson) =>
                    lesson.id === lessonId ? { ...lesson, [url]: response.data } : lesson
                )
            );
        } catch (error) {
            console.error(`Error updating ${type}:`, error);
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteFile = async (lessonId, field) => {
        if (window.confirm("Are you sure you want to delete this file?")) {
            try {
                await ApiCall(`/api/v1/lesson/${lessonId}/${field}`, "DELETE");

                // Update the lessons state to remove the file
                setLessons((prevLessons) =>
                    prevLessons.map((lesson) =>
                        lesson.id === lessonId ? { ...lesson, [field]: null } : lesson
                    )
                );
            } catch (error) {
                console.error("Error deleting file:", error);
            }
        }
    };

    const handleDeleteSubjectFile = async (subject, field) => {
        if (window.confirm("Are you sure you want to delete this file?")) {
            try {
                await ApiCall(`/api/v1/subject/${subject}/${field}`, "DELETE");
                await fetchSubject();
            } catch (error) {
                console.error("Error deleting file:", error);
            }
        }
    };
    const handleEditLesson = async (lesson)=>{
        setFormDataLesson({
            id:lesson.id,
            name: lesson.name,
            youtubeIframeLink: lesson.youtubeIframeLink
        })
        setIsAddModalVisible(true)
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormDataLesson({ ...formDataLesson, [name]: value });
    };
    const handleSaveEditLesson= async () => {
        try {
            await ApiCall(`/api/v1/lesson/edit/${formDataLesson.id}`, "PUT", formDataLesson, null, true);
            setIsAddModalVisible(false)
            setFormDataLesson({ name: "", id: null, youtubeIframeLink: ""});
            fetchLessons();
        } catch (error) {
            console.error("Error updating direction:", error);
        }
    };



    return (
        <div className="p-4 flex flex-wrap ">
            <button className={"bg-blue-600 p-1 rounded h-1/2 "}
            onClick={()=>navigate("/dashboard/subject")}>

                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 12h14M5 12l4-4m-4 4 4 4"/>
                </svg>

            </button>
            <h1 className="text-2xl font-bold mb-4">
               Fan nomi: {

                    subject?.name
                }
            </h1>



            <table className="min-w-full bg-white border border-gray-300 mt-4">
                <thead>
                <tr className="bg-gray-200">
                    <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">ID</th>
                    <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Fan nomi</th>
                    <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Soati</th>
                    <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">O'quv dasturi(.pdf)</th>
                    <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">O'quv dasturi(word)</th>
                    <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Sillabus(.pdf)</th>
                    <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Sillabus(word)</th>
                    <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Namunaviy dastur</th>
                </tr>
                </thead>
                <tbody>
                <tr key={subject?.id} className="border-b border-gray-300">
                    <td className="px-1 py-1 text-sm text-gray-900 border border-gray-300">{subject?.id}</td>
                    <td className="px-1 py-1 text-sm text-gray-900 border border-gray-300">{subject?.name}</td>
                    <td className="px-1 py-1 text-sm text-gray-900 border border-gray-300">
                        <div>
                            <p className={"p-0 m-0 text-md"}>M/S/A/L</p>
                            <p className={"p-0 m-0"}>
                                {subject?.semesterCounts?.map((count) => `${count?.maruzaCount}/${count.seminarCount}/${count.amaliyCount}/${count.labaratoriyaCount}`)
                                    .join(", ")}
                            </p>
                        </div>
                    </td>
                    <td className="px-1 py-1 text-sm text-gray-900 border border-gray-300">
                        <div style={{width:"200px"}}>
                        {subject?.oquvDasturiPdf === null ? (
                            <>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => handleFileUpload(e.target.files[0],  "/" + subject.name + '/oquv-dasturi-pdf')}
                                    disabled={loading}
                                />
                                <p className={"text-red-500 p-1 rounded"}>Mavjud emas</p>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleDownload(subject.oquvDasturiPdf)} className="bg-blue-500 text-white p-1 rounded-xl">
                                    Yuklab olish
                                </button>
                                <button onClick={()=>handleDeleteSubjectFile(subject.id, "oquv-dasturi-pdf")} className="bg-red-500 text-white p-1 rounded-xl">
                                    O'chirish
                                </button>
                            </>

                        )}
                        </div>
                    </td>
                    <td  className="px-1 py-1 text-sm text-gray-900 border border-gray-300">
                        <div style={{width:"200px"}}>
                            {subject?.oquvDasturiWord === null ? (
                                <>
                                    <input
                                        type="file"
                                        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (
                                                file &&
                                                !["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)
                                            ) {
                                                alert("Iltimos, faqat Word fayl yuklang! (.doc yoki .docx)");
                                                return;
                                            }
                                            handleFileUpload(file, "/" + subject.name + "/oquv-dasturi-word");
                                        }}
                                        disabled={loading}
                                    />
                                    <p className={"text-red-500 p-1 rounded"}>Mavjud emas</p>
                                </>
                            ) : (
                                <>

                                    <button onClick={() => handleDownload(subject.oquvDasturiWord)} className="bg-blue-500 text-white p-1 rounded-xl">
                                        Yuklab olish
                                    </button>
                                    <button  onClick={()=>handleDeleteSubjectFile(subject.id, "oquv-dasturi-word")} className="bg-red-500 text-white p-1 rounded-xl">
                                        O'chirish
                                    </button>
                                </>

                            )}

                        </div>

                    </td>
                    <td className="px-1 py-1 text-sm text-gray-900 border border-gray-300">
                        <div style={{width:"200px"}}>
                        {subject?.sillabusPdf === null ? (
                            <>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => handleFileUpload(e.target.files[0], "/" + subject.name + "/sillabus-pdf")}
                                    disabled={loading}
                                />

                                <p className={"text-red-500 p-1 rounded"}>Mavjud emas</p>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleDownload(subject.sillabusPdf)} className="bg-blue-500 text-white p-1 rounded-xl">
                                    Yuklab olish
                                </button>
                                <button onClick={()=>handleDeleteSubjectFile(subject.id, "sillabus-pdf")} className="bg-red-500 text-white p-1 rounded-xl">
                                    O'chirish
                                </button>
                            </>

                        )}
                        </div>
                    </td>
                    <td className="px-1 py-1 text-sm text-gray-900 border border-gray-300">
                        <div style={{width:"200px"}}>
                        {subject?.sillabusWord === null ? (
                            <>
                                <input
                                    type="file"
                                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={(e) => handleFileUpload(e.target.files[0], "/" + subject.name + "/sillabus-word")}
                                    disabled={loading}
                                />

                                <p className={"text-red-500 p-1 rounded"}>Mavjud emas</p>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleDownload(subject.sillabusPdf)} className="bg-blue-500 text-white p-1 rounded-xl">
                                    Yuklab olish
                                </button>
                                <button onClick={()=>handleDeleteSubjectFile(subject.id, "sillabus-word")} className="bg-red-500 text-white p-1 rounded-xl">
                                    O'chirish
                                </button>

                            </>

                        )}
                        </div>
                    </td>
                    <td className="px-1 py-1 text-sm text-gray-900 border border-gray-300">
                        <div style={{width:"200px"}}>
                        {subject?.namunaviyDastur === null ? (
                            <>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => handleFileUpload(e.target.files[0], "/" + subject.name + "/namunaviy-dastur")}
                                    disabled={loading}
                                />

                                <p className={"text-red-500 p-1 rounded"}>Mavjud emas</p>
                            </>
                        ) : (
                            <>


                                <button href={`/api/v1/file/download/${subject?.sillabus?.id}`} className="bg-red-500 text-white p-1 rounded-xl">
                                    O'chirish
                                </button>
                                <button onClick={()=>handleDeleteSubjectFile(subject.id, "namunaviy-dastur")} className="bg-blue-500 text-white p-1 rounded-xl">
                                    Yuklab olish
                                </button>
                            </>

                        )}
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
<hr/>
            <h2 className="text-xl font-bold mt-6 mb-4 text-center">Darslar</h2>
            {[...new Set(lessons?.map((lesson) => lesson.subjectSemester))].map((semester) => (
                <div key={semester} className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">{semester}-Semester </h3>
                    <table className=" bg-white border border-gray-300">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">T/R</th>
                            <th className=" py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Mavzu nomi</th>
                            <th className=" py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Dars turi</th>
                            <th  className=" py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Maruza matni</th>
                            <th className=" py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Taqdimot </th>
                            <th className=" py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Test </th>
                            <th className=" py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Glossary </th>
                            <th className=" py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Amaliy topshiriq </th>
                            <th className=" py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">Qo'shimcha topshiriq </th>
                            <th className=" py-3 text-left text-sm font-medium text-gray-700 border border-gray-300"> Video </th>
                            <th className=" py-3 text-left text-sm font-medium text-gray-700 border border-gray-300">  </th>
                        </tr>
                        </thead>
                        <tbody>
                        {lessons
                            ?.filter((lesson) => lesson.subjectSemester === semester)
                            .map((lesson, index) => (
                                <tr key={lesson.id} className="border-b border-gray-300">
                                    <td className=" py-1 text-sm text-gray-900 border border-gray-300">
                                      {lesson.lessonOrder}
                                    </td>
                                    <td className=" py-1 text-sm text-gray-900 border border-gray-300">
                                      <div style={{width:"450px"}}> {lesson.name}</div> </td>
                                    <td className=" py-1 text-sm text-gray-900 border border-gray-300">
                                      <div style={{width:"100px"}}>
                                          {lesson.lessonType === 1 ? "Maruza" :
                                              lesson.lessonType === 2 ? "Seminar" :
                                                  lesson.lessonType === 3 ? "Amaliy" : "Labaratoriya"}
                                      </div>
                                    </td>
                                    <td   className=" py-1 px-1 text-sm text-gray-900 border border-gray-300">
                                        {lesson?.matni === null ? (
                                            <div style={{width:"100px"}} className={"flex flex-wrap text-white "}>
                                                <input
                                                    type="file"
                                                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            handleFileUploadLessonFile(
                                                                "matni",
                                                                file,
                                                                "/" +
                                                                subject.name +
                                                                "/" +
                                                                semester +
                                                                "-semester/" +
                                                                (lesson.lessonType === 1
                                                                    ? "Maruza"
                                                                    : lesson.lessonType === 2
                                                                        ? "Seminar"
                                                                        : lesson.lessonType === 3
                                                                            ? "Amaliy"
                                                                            : "Labaratoriya") +"/"+ lesson.lessonOrder + "/maruza matni/"
                                                                ,
                                                                lesson.id
                                                            );
                                                        }
                                                    }}
                                                    disabled={loading}
                                                />


                                            </div>
                                        ) : (
                                            <>
                                                <button className="bg-blue-500 text-white p-1 rounded-1"
                                                        onClick={() => handleDownload(lesson.matni)}>
                                                    <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                         height="24" fill="currentColor" viewBox="0 0 24 24">
                                                        <path fill-rule="evenodd"
                                                              d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z"
                                                              clip-rule="evenodd"/>
                                                        <path fill-rule="evenodd"
                                                              d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                                                              clip-rule="evenodd"/>
                                                    </svg>
                                                </button>
                                                <button className="bg-red-500 text-white p-1 rounded-1"
                                                        onClick={() => handleDeleteFile(lesson.id, "matni")}>
                                                    <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                         width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                        <path fill-rule="evenodd"
                                                              d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                                              clip-rule="evenodd"/>
                                                    </svg>

                                                </button>
                                            </>
                                        )}
                                    </td>
                                    <td className=" py-1 px-1 text-sm text-gray-900 border border-gray-300">
                                        {lesson.taqdimot === null ? (
                                            <div style={{width:"100px"}} className={"flex flex-wrap text-white "}>
                                                <input
                                                    type="file"
                                                    accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                                    onChange={(e) => handleFileUploadLessonFile(
                                                        "taqdimot",
                                                        e.target.files[0],
                                                        "/" +
                                                        subject.name +
                                                        "/" +
                                                        semester +
                                                        "-semester/" +
                                                        (lesson.lessonType === 1
                                                            ? "Maruza"
                                                            : lesson.lessonType === 2
                                                                ? "Seminar"
                                                                : lesson.lessonType === 3
                                                                    ? "Amaliy"
                                                                    : "Labaratoriya") +"/"+ lesson.lessonOrder+ "/taqdimot/" ,
                                                        lesson.id
                                                    )}
                                                    disabled={loading}
                                                />


                                            </div>

                                        ) : (
                                            <>
                                                <button className="bg-blue-500 text-white p-1 rounded-1"
                                                        onClick={() => handleDownload(lesson.taqdimot)}>
                                                    <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                         height="24" fill="currentColor" viewBox="0 0 24 24">
                                                        <path fill-rule="evenodd"
                                                              d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z"
                                                              clip-rule="evenodd"/>
                                                        <path fill-rule="evenodd"
                                                              d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                                                              clip-rule="evenodd"/>
                                                    </svg>
                                                </button>
                                                <button className="bg-red-500 text-white p-1 rounded-1"
                                                        onClick={() => handleDeleteFile(lesson.id, "taqdimot")}>
                                                    <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                         width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                        <path fill-rule="evenodd"
                                                              d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                                              clip-rule="evenodd"/>
                                                    </svg>

                                                </button>
                                            </>

                                        )}
                                    </td>
                                    <td className="py-1 px-1 text-sm text-gray-900 border border-gray-300">
                                        {lesson.test === null ? (
                                            <div style={{width:"100px"}} className={"flex flex-wrap text-white "}>
                                                <input
                                                    type="file"
                                                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                    onChange={(e) => handleFileUploadLessonFile(
                                                        "test",
                                                        e.target.files[0],
                                                        "/" +
                                                        subject.name +
                                                        "/" +
                                                        semester +
                                                        "-semester/" +
                                                        (lesson.lessonType === 1
                                                            ? "Maruza"
                                                            : lesson.lessonType === 2
                                                                ? "Seminar"
                                                                : lesson.lessonType === 3
                                                                    ? "Amaliy"
                                                                    : "Labaratoriya") +"/"+lesson.lessonOrder+ "/test/" ,
                                                        lesson.id
                                                    )}
                                                    disabled={loading}
                                                />


                                            </div>

                                        ) : (
                                            <>
                                                <button className="bg-blue-500 text-white p-1 rounded-1"
                                                        onClick={() => handleDownload(lesson.test)}>
                                                    <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                         height="24" fill="currentColor" viewBox="0 0 24 24">
                                                        <path fill-rule="evenodd"
                                                              d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z"
                                                              clip-rule="evenodd"/>
                                                        <path fill-rule="evenodd"
                                                              d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                                                              clip-rule="evenodd"/>
                                                    </svg>
                                                </button>
                                                <button className="bg-red-500 text-white p-1 rounded-1"
                                                        onClick={() => handleDeleteFile(lesson.id, "test")}>
                                                    <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                         width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                        <path fill-rule="evenodd"
                                                              d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                                              clip-rule="evenodd"/>
                                                    </svg>

                                                </button>
                                            </>


                                        )}</td>
                                    <td className=" py-1 px-1 text-sm text-gray-900 border border-gray-300">
                                        {lesson.glossary === null ? (
                                            <div style={{width:"100px"}} className={"flex flex-wrap text-white "}>
                                                <input
                                                    type="file"
                                                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                    onChange={(e) => handleFileUploadLessonFile(
                                                        "glossary",
                                                        e.target.files[0],
                                                        "/" +
                                                        subject.name +
                                                        "/" +
                                                        semester +
                                                        "-semester/" +
                                                        (lesson.lessonType === 1
                                                            ? "Maruza"
                                                            : lesson.lessonType === 2
                                                                ? "Seminar"
                                                                : lesson.lessonType === 3
                                                                    ? "Amaliy"
                                                                    : "Labaratoriya")+"/" +lesson.lessonOrder+
                                                        "/glossary/" ,
                                                        lesson.id
                                                    )}
                                                    disabled={loading}
                                                />


                                            </div>
                                        ) : (
                                            <>
                                                <button className="bg-blue-500 text-white p-1 rounded-1"
                                                        onClick={() => handleDownload(lesson.glossary)}>
                                                    <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                         height="24" fill="currentColor" viewBox="0 0 24 24">
                                                        <path fill-rule="evenodd"
                                                              d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z"
                                                              clip-rule="evenodd"/>
                                                        <path fill-rule="evenodd"
                                                              d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                                                              clip-rule="evenodd"/>
                                                    </svg>
                                                </button>
                                                <button className="bg-red-500 text-white p-1 rounded-1"
                                                        onClick={() => handleDeleteFile(lesson.id, "glossary")}>
                                                    <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                         width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                        <path fill-rule="evenodd"
                                                              d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                                              clip-rule="evenodd"/>
                                                    </svg>

                                                </button>
                                            </>

                                        )}</td>
                                    <td className="py-1 px-1 text-sm text-gray-900 border border-gray-300">
                                        {lesson.amaliy === null ? (
                                            <div style={{width:"100px"}} className={"flex flex-wrap text-white "}>
                                                <input
                                                    type="file"
                                                onChange={(e) => handleFileUploadLessonFile("amaliy", e.target.files[0], "/" + subject.name+ '/' +semester + '-semester/' + (lesson.lessonType === 1 ? "Maruza" : lesson.lessonType === 2 ? "Seminar" : lesson.lessonType === 3 ? "Amaliy" : "Labaratoriya") +"/" + lesson.lessonOrder+ "/amaliy"  , lesson.id)}
                                                disabled={loading}
                                            />

                                        </div>

                                    ) : (
                                        <>

                                            <button className="bg-blue-500 text-white p-1 rounded-1"
                                                    onClick={() => handleDownload(lesson.amaliy)}>
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                     height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd"
                                                          d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z"
                                                          clip-rule="evenodd"/>
                                                    <path fill-rule="evenodd"
                                                          d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                                                          clip-rule="evenodd"/>
                                                </svg>
                                            </button>
                                            <button className="bg-red-500 text-white p-1 rounded-1"
                                                    onClick={() => handleDeleteFile(lesson.id, "amaliy")}>
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                     height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd"
                                                          d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                                          clip-rule="evenodd"/>
                                                </svg>

                                            </button>
                                        </>

                                        )}</td>
                                    <td className="py-1 px-1 text-sm text-gray-900 border border-gray-300">
                                        {lesson.qoshimcha === null ? (
                                            <div style={{width:"100px"}} className={"flex flex-wrap text-white "}>
                                                <input
                                                    type="file"
                                                onChange={(e) => handleFileUploadLessonFile("qoshimcha", e.target.files[0], "/" + subject.name+ '/' +semester + '-semester/' + (lesson.lessonType === 1 ? "Maruza" : lesson.lessonType === 2 ? "Seminar" : lesson.lessonType === 3 ? "Amaliy" : "Labaratoriya") + "/" + lesson.lessonOrder + "/qoshimcha" , lesson.id)}
                                                disabled={loading}
                                            />

                                        </div>

                                    ) : (
                                        <>
                                            <button className="bg-blue-500 text-white p-[2px] rounded-1"
                                                    onClick={() => handleDownload(lesson.qoshimcha)}>

                                                <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                     height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd"
                                                          d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z"
                                                          clip-rule="evenodd"/>
                                                    <path fill-rule="evenodd"
                                                          d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                                                          clip-rule="evenodd"/>
                                                </svg>

                                            </button>
                                            <button className="bg-red-500 text-white p-1 rounded-1"
                                                    onClick={() => handleDeleteFile(lesson.id, "qoshimcha")}>
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                     height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd"
                                                          d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                                          clip-rule="evenodd"/>
                                                </svg>

                                            </button>
                                        </>

                                        )}</td>
                                    <td className="py-1 px-1 text-sm text-gray-900 border border-gray-300">
                                        {lesson.youtubeIframeLink === null ? (
                                            <p className="text-red-500 p-1 rounded">Mavjud emas</p>
                                        ) : (
                                            <button
                                                className={"bg-yellow-500 p-1 rounded-xl"}
                                                onClick={() => {
                                                    setSelectedLesson(lesson);
                                                    setIsYoutubeModalVisible(true);
                                                }}
                                            >
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                     height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-width="2"
                                                          d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                                    <path stroke="currentColor" stroke-width="2"
                                                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                </svg>
                                            </button>
                                        )}
                                    </td>


                                    <td className="px-1 py-1 text-sm text-gray-900 border border-gray-300">
                                        <button className={"bg-blue-600 p-1 rounded-xl"}
                                                onClick={() => handleEditLesson(lesson)}
                                        >
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                                 viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
                                            </svg>

                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}


            <Rodal  width={400} height={400} visible={isAddModalVisible} onClose={() => setIsAddModalVisible(false)}>


                <h2 className="text-xl font-bold mb-4">Tahrirlash</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Mavzu nomi</label>
                        <input
                            type="text"
                            name="name"
                            value={formDataLesson.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Youtube iframe link</label>
                        <textarea
                            name="youtubeIframeLink"
                            value={formDataLesson.youtubeIframeLink}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <button
                        type="button"

                        onClick={handleSaveEditLesson}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Yangilash
                    </button>
                </form>
            </Rodal>
            <Rodal
                width={600}
                height={400}
                visible={isYoutubeModalVisible}
                onClose={() => setIsYoutubeModalVisible(false)}
            >
                <h2 className="text-xl font-bold mb-4">YouTube Video</h2>
                {selectedLesson && (
                    <div dangerouslySetInnerHTML={{ __html: selectedLesson.youtubeIframeLink }} />
                )}
            </Rodal>

        </div>
    );
}

export default AdminSubject;