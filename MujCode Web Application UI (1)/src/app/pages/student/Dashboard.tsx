import StudentLayout from '../../components/StudentLayout';
import YearlyActivity from '../../components/YearlyActivity';
import StudentStats from '../../components/StudentStats';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Trophy,
  Users,
  Calendar,
  Clock
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [ranks, setRanks] = useState([
    { label: 'College Rank', value: '#-', total: '/ -' },
    { label: 'Branch Rank', value: '#-', total: '/ -' },
    { label: 'Section Rank', value: '#-', total: '/ -' }
  ]);
  const [loadingRanks, setLoadingRanks] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;

        if (!userId) {
          setLoadingRanks(false);
          return;
        }

        const res = await fetch(`http://localhost:5000/api/student/rankings/${userId}`);
        const data = await res.json();

        if (res.ok && data.ranks) {
          setRanks(data.ranks);
        }
        setLoadingRanks(false);
      } catch (error) {
        console.error('Error fetching rankings:', error);
        setLoadingRanks(false);
      }
    };

    fetchRankings();
  }, []);

  const mentors = [
    { name: 'Dr. Sarah Johnson', subject: 'Data Structures', avatar: 'SJ' },
    { name: 'Prof. Michael Chen', subject: 'Algorithms', avatar: 'MC' },
    { name: 'Dr. Priya Sharma', subject: 'Database Systems', avatar: 'PS' }
  ];

  const upcomingTests = [
    { title: 'Data Structures Final Test', date: '2026-01-15', time: '10:00 AM', type: 'Coding' },
    { title: 'Database Lab Test', date: '2026-01-18', time: '2:00 PM', type: 'Lab' },
    { title: 'Algorithm Quiz', date: '2026-01-20', time: '11:00 AM', type: 'Quiz' }
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {JSON.parse(localStorage.getItem('user') || '{}').name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-gray-600">Here's your learning progress overview</p>
        </div>

        {/* New LeetCode-style Stats & Badges */}
        <StudentStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ranks */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-[#FF7A00]" />
                <span>Your Rankings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ranks.map((rank, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{rank.label}</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-[#FF7A00]">{rank.value}</span>
                    <span className="text-sm text-gray-500 ml-1">{rank.total}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Faculty Mentors */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#FF7A00]" />
                <span>Faculty Mentors</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mentors.map((mentor, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-[#FF7A00] rounded-full flex items-center justify-center text-white font-semibold">
                    {mentor.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{mentor.name}</p>
                    <p className="text-sm text-gray-500">{mentor.subject}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Tests */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#FF7A00]" />
                <span>Upcoming Tests</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTests.map((test, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900 text-sm">{test.title}</p>
                    <span className="px-2 py-1 bg-[#FF7A00] text-white text-xs rounded-full">
                      {test.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {test.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {test.time}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Activity Heat Map */}
        <YearlyActivity />
      </div>
    </StudentLayout>
  );
}
