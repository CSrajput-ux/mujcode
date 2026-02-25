import { API_URL, API_BASE_URL, UPLOADS_URL } from '@/shared/config/apiConfig';
import StudentLayout from '../../shared/components/StudentLayout';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Search, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Problems() {
  const [filteredProblems, setFilteredProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [solvedProblemIds, setSolvedProblemIds] = useState<number[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const limit = 50;


  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchProblems(currentPage);
  }, [currentPage, selectedCategory, selectedDifficulty, selectedTopic, searchQuery]);

  const fetchProblems = async (page: number) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Construct URL with filters and pagination
      const params = new URLSearchParams();
      if (user.id) params.append('userId', user.id);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);
      if (selectedTopic !== 'All') params.append('topic', selectedTopic);
      if (searchQuery) params.append('search', searchQuery);

      const url = `${API_URL}/problems?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setFilteredProblems(data.problems);
        setTotalPages(data.pagination.totalPages);
        setTotalProblems(data.pagination.total);

        // Extract solved problem IDs
        const solved = data.problems
          .filter((p: any) => p.status === 'solved')
          .map((p: any) => p.number);
        setSolvedProblemIds(solved);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching problems:', error);
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const res = await fetch('${API_URL}/problems/metadata');
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
        setTopics(data.topics || []);
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedDifficulty, selectedTopic, searchQuery]);

  const difficultyColors = {
    Easy: 'text-green-600 bg-green-50',
    Medium: 'text-yellow-600 bg-yellow-50',
    Hard: 'text-red-600 bg-red-50'
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading problems...</div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Problems</h1>
          <p className="text-gray-600">Solve coding challenges and improve your skills</p>
        </div>

        {/* Filter Bar */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Topics</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Difficulty */}
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Levels</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              {/* Topic */}
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Topics</SelectItem>
                  {topics.map(topic => (
                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Problems Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acceptance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        No problems found
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((problem) => (
                      <tr
                        key={problem._id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => window.location.href = `/student/problems/${problem.number}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {solvedProblemIds.includes(problem.number) ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-500 text-sm font-mono">
                              {problem.number}.
                            </span>
                            <div>
                              <div className="font-medium text-gray-900">{problem.title}</div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {problem.topic}
                                </Badge>
                                <Badge variant="outline" className="text-xs text-gray-500">
                                  {problem.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {problem.acceptanceRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={difficultyColors[problem.difficulty as keyof typeof difficultyColors]}>
                            {problem.difficulty}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination & Summary */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
          <div className="text-sm text-gray-500 order-2 md:order-1">
            Showing {filteredProblems.length > 0 ? (currentPage - 1) * limit + 1 : 0} to {Math.min(currentPage * limit, totalProblems)} of {totalProblems} problems
          </div>

          <div className="flex items-center space-x-2 order-1 md:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center space-x-1 px-4">
              <span className="text-sm font-medium text-gray-900">Page {currentPage}</span>
              <span className="text-sm text-gray-400">of {totalPages}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

