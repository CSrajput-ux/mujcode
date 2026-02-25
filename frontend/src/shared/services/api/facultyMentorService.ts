import { API_URL, API_BASE_URL, UPLOADS_URL } from '@/shared/config/apiConfig';
import axios from 'axios';

const API_URL = '${API_URL}/faculty';

// Configure axios for credentials (cookies)
axios.defaults.withCredentials = true;

export interface MentorRequest {
    _id: string;
    studentId: string;
    studentName: string;
    registrationId: string;
    department: string;
    section: string;
    academicYear: string;
    semester: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export const getMentorRequests = async (): Promise<MentorRequest[]> => {
    const response = await axios.get(`${API_URL}/mentor-requests`);
    return response.data;
};

export const approveMentorRequest = async (requestId: string): Promise<any> => {
    const response = await axios.patch(`${API_URL}/approve-mentor/${requestId}`);
    return response.data;
};

export const rejectMentorRequest = async (requestId: string): Promise<any> => {
    const response = await axios.patch(`${API_URL}/reject-mentor/${requestId}`);
    return response.data;
};

export const bulkApproveMentorRequests = async (data: { section: string, academicYear: string, semester: string }): Promise<any> => {
    const response = await axios.patch(`${API_URL}/bulk-approve`, data);
    return response.data;
};

