import { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { FiDownload, FiAward } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

const ReportCard = () => {
    const { user } = useContext(AuthContext);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                // Determine Student ID: if student logged in uses user._id (via student profile lookup in backend) 
                // Wait, our backend endpoint `/results/student/:studentId` needs studentId (Profile ID), not User ID.
                // But studentController getDashboardData uses req.user._id to find Student Profile.
                // We should probably have an endpoint that auto-resolves for "me".
                // Or we fetch profile first.

                // Fetch profile to get Student ID
                const profileRes = await api.get('/users/profile'); // This returns user info.
                // Actually let's assume we stored student profile ID or use a dedicated 'my-results' endpoint.
                // For now, let's look up Student Profile ID via dashboard call or assumption?

                // Better: Let's fetch the Student Profile by user ID first?
                // Or simplified: Just use the endpoint if we know it. 
                // Trick: modify backend to accept 'me' or handle in frontend.

                // Let's rely on dashboard/profile being loaded or fetch dashboard first to get ID?
                // Actually, let's try to fetch all students again? No.

                // Let's try to assume backend controller `getStudentResults` expects Student Profile ID.
                // We need to find `Student` doc where `user` == `user._id`.
                // Let's quickly search via existing API?
                // `api.get('/students/dashboard')` returns classTeacher etc but maybe we can just add `_id` to it?

                // Let's modify frontend to assume we need to find student ID.
                // Hack: We can filter `api.get('/students')`? No, restrictive.

                // Let's assume we can GET `/students/me`? No.
                // Let's just fetch dashboard data which we know works, and maybe it contains student info?
                // Dashboard endpoint returns `{ classTeacher, ... }`. It doesn't return student ID explicitly.

                // Alternative: The user object in AuthContext sometimes has it if we modify login?
                // Creating a lookup here:
                // Find student by email? 

                // Let's try to assume the user IS the student and passes user._id? 
                // Backend: `const results = await Result.find({ student: studentId })`.
                // If we pass User ID, it won't match Student ID.

                // Solution: Add a quick lookup.
                // We'll hit a new endpoint or use existing? 
                // Let's just create a helper logic here: 
                // We can't easily get Student ID without an endpoint.

                // Let's hardcode for now or fix backend to allow "me"?
                // Let's fix backend to allow "me" in next step if needed. 
                // Wait, I can just use `api.get('/users/profile')` -> check role -> if student, find student profile?

                // Actually, let's use the `/api/students/dashboard` and verify if it returns ID.
                // It doesn't. 

                // I will update the backend `getStudentResults` to handle `studentId === 'me'` and resolve it server side.
                // This is cleaner.

                const { data } = await api.get('/exams/results/student/me');
                setResults(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Report Cards</h1>

            {results.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-gray-500">No report cards available yet.</p>
                </div>
            ) : (
                <div className="grid gap-8">
                    {results.map(result => (
                        <div key={result._id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden relative print:shadow-none print:border">
                            {/* Header */}
                            <div className="bg-blue-600 p-6 text-white flex justify-between items-center print:bg-gray-100 print:text-black">
                                <div>
                                    <h2 className="text-2xl font-bold">{result.exam?.name}</h2>
                                    <p className="opacity-90">{result.exam?.academicYear} • {result.exam?.term}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">{result.grade}</div>
                                    <div className="text-sm opacity-90">{result.percentage.toFixed(1)}%</div>
                                </div>
                            </div>

                            {/* Marks Table */}
                            <div className="p-6">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-slate-700 text-sm text-gray-500">
                                            <th className="py-3">Subject</th>
                                            <th className="py-3 text-right">Max Marks</th>
                                            <th className="py-3 text-right">Obtained</th>
                                            <th className="py-3 text-right">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                        {result.subjects.map((sub, idx) => (
                                            <tr key={idx}>
                                                <td className="py-3 font-medium dark:text-white">{sub.subject?.name}</td>
                                                <td className="py-3 text-right text-gray-500">{sub.totalMarks}</td>
                                                <td className="py-3 text-right font-bold dark:text-white">{sub.marksObtained}</td>
                                                <td className="py-3 text-right text-sm">
                                                    {/* Simple individual Subject Grade calc if not stored */}
                                                    {(sub.marksObtained / sub.totalMarks * 100) >= 90 ? 'A+' :
                                                        (sub.marksObtained / sub.totalMarks * 100) >= 80 ? 'A' :
                                                            (sub.marksObtained / sub.totalMarks * 100) >= 35 ? 'P' : 'F'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t border-gray-200 dark:border-slate-600 font-bold text-gray-800 dark:text-white">
                                            <td className="py-4">Total</td>
                                            <td className="py-4 text-right">{result.totalMax}</td>
                                            <td className="py-4 text-right">{result.totalObtained}</td>
                                            <td className="py-4 text-right">{result.grade}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Actions */}
                            <div className="p-4 bg-gray-50 dark:bg-slate-900/50 flex justify-end print:hidden">
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    <FiDownload /> Download / Print PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportCard;
