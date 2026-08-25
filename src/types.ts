export interface Topic {
  id: number;
  title: string;
  subtopics: string[];
  isAssigned?: boolean;
  assignedTo?: string | null;
}

export interface Assignment {
  id: string;
  topicId: number;
  groupName: string;
  students: string;
  assignedAt: string;
  classroom?: string;
  guideMarkdown?: string;
  comments?: string;
  grade?: string;
}
