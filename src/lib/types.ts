
export interface Author {
  name: string;
  isCorresponding: boolean;
}

export interface StudentScholar {
  name: string;
  id: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: Author[];
  facultyId: string;
  scopusId: string;
  category: string; 
  department: string; 
  college: string;
  publicationDate: string;
  journal: string;
  volume: string;
  doi: string;
  type: 'journal' | 'conference' | 'book';
  volumeName: string;
  issue: string;
  pageNo: string;
  hasScopus: boolean;
  claimedBy: string;
  authorNo: string;
  isStudentScholar: boolean;
  studentScholars: StudentScholar[];
  q1: string;
  q2: string;
}

export interface Department {
  id: string;
  name: string;
  collegeId: string;
  category: string;
}

export interface College {
  id: string;
  name: string;
  categories: string[];
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  password?: string;
  college?: string;
  category?: string; 
}
