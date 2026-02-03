import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Award, Lock, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StudentStats() {
    const [loading, setLoading] = useState(true);
    const [solved, setSolved] = useState({
        easy: 0,
        medium: 0,
        hard: 0,
        total: 0,
        totalQuestions: 500
    });
    const [badges, setBadges] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const userId = user.id;

                if (!userId) {
                    setLoading(false);
                    return;
                }

                // Fetch stats
                const statsRes = await fetch(`http://localhost:5000/api/student/stats/${userId}`);
                const statsData = await statsRes.json();

                if (statsRes.ok && statsData.solved) {
                    setSolved({ ...statsData.solved, totalQuestions: 500 });
                }

                // Fetch badges
                const badgesRes = await fetch(`http://localhost:5000/api/student/badges/${userId}`);
                const badgesData = await badgesRes.json();

                if (badgesRes.ok) {
                    setBadges(badgesData.badges || []);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching student stats:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalEasy = 150;
    const totalMedium = 200;
    const totalHard = 150;

    // Calculate percentages
    const easyPct = (solved.easy / totalEasy) * 100;
    const medPct = (solved.medium / totalMedium) * 100;
    const hardPct = (solved.hard / totalHard) * 100;
    const totalPct = (solved.total / solved.totalQuestions) * 100;

    // Circular Progress Component
    const CircularProgress = ({ value, color, size = 120, strokeWidth = 8 }: { value: number, color: string, size?: number, strokeWidth?: number }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (value / 100) * circumference;

        return (
            <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        className="text-gray-200"
                        strokeWidth={strokeWidth}
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    <circle
                        className={`${color} transition-all duration-1000 ease-out`}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    {/* Center Content goes here - passed as children usually, but hardcoded for this specific view */}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md border-none">
                    <CardHeader><CardTitle>Solved Problems</CardTitle></CardHeader>
                    <CardContent>
                        <div className="animate-pulse flex space-x-4">
                            <div className="rounded-full bg-gray-200 h-32 w-32"></div>
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-md border-none">
                    <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
                    <CardContent>
                        <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Solved Problems */}
            <Card className="shadow-md border-none">
                <CardHeader>
                    <CardTitle>Solved Problems</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                        {/* Main Circle */}
                        <div className="relative flex flex-col items-center justify-center">
                            <CircularProgress value={totalPct} color="text-[#FF7A00]" size={160} strokeWidth={12} />
                            <div className="absolute flex flex-col items-center text-center">
                                <span className="text-4xl font-bold text-gray-900">{solved.total}</span>
                                <span className="text-xs text-green-500 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Solved
                                </span>
                                <span className="text-xs text-gray-400 mt-1">0 Attempting</span>
                            </div>
                        </div>

                        {/* Breakdown - Easy/Med/Hard Stats */}
                        <div className="flex flex-col gap-3">
                            {/* Easy */}
                            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 min-w-[100px]">
                                <div className="text-sm font-medium text-green-600">Easy</div>
                                <div className="font-bold">
                                    <span className="text-green-600">{solved.easy}</span>
                                    <span className="text-gray-400">/{totalEasy}</span>
                                </div>
                            </div>
                            {/* Medium */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 min-w-[100px]">
                                <div className="text-sm font-medium text-yellow-600">Med.</div>
                                <div className="font-bold">
                                    <span className="text-yellow-600">{solved.medium}</span>
                                    <span className="text-gray-400">/{totalMedium}</span>
                                </div>
                            </div>
                            {/* Hard */}
                            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 min-w-[100px]">
                                <div className="text-sm font-medium text-red-600">Hard</div>
                                <div className="font-bold">
                                    <span className="text-red-600">{solved.hard}</span>
                                    <span className="text-gray-400">/{totalHard}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Badges */}
            <Card className="shadow-md border-none">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Badges</span>
                        <span className="text-2xl font-bold text-gray-900">{badges.length}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {badges.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium mb-2">No badges earned yet</p>
                            <p className="text-sm">Complete courses to unlock badges!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {badges.map((badge: any, index: number) => (
                                <div key={index} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#FF7A00] transition-colors group cursor-pointer">
                                    <div className="w-16 h-16 mb-2 flex items-center justify-center">
                                        <Award className="w-10 h-10 text-blue-500" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">{badge.name}</span>
                                    <span className="text-[10px] text-gray-500">{new Date(badge.earnedAt).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
