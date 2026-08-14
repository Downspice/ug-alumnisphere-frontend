import { fetchGraphQL, ApiResponse } from "../client";

export interface Question {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
}

export interface QuestionInput {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  points?: number;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  questions: Question[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExamInput {
  title: string;
  description?: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  questions?: QuestionInput[];
  isPublished?: boolean;
}

export interface UpdateExamInput {
  title?: string;
  description?: string;
  durationMinutes?: number;
  totalMarks?: number;
  passingMarks?: number;
  questions?: QuestionInput[];
  isPublished?: boolean;
}

export const examsApi = {
  /**
   * Fetch all exams with optional published filter
   */
  async getAll(isPublished?: boolean): Promise<ApiResponse<{ exams: Exam[] }>> {
    const query = `
      query GetExams($isPublished: Boolean) {
        exams(isPublished: $isPublished) {
          id
          title
          description
          durationMinutes
          totalMarks
          passingMarks
          isPublished
          createdAt
          updatedAt
          questions {
            questionText
            options
            correctOptionIndex
            points
          }
        }
      }
    `;

    return fetchGraphQL<{ exams: Exam[] }>(query, { isPublished });
  },

  /**
   * Fetch single exam by ID
   */
  async getById(id: string): Promise<ApiResponse<{ exam: Exam | null }>> {
    const query = `
      query GetExam($id: ID!) {
        exam(id: $id) {
          id
          title
          description
          durationMinutes
          totalMarks
          passingMarks
          isPublished
          createdAt
          updatedAt
          questions {
            questionText
            options
            correctOptionIndex
            points
          }
        }
      }
    `;

    return fetchGraphQL<{ exam: Exam | null }>(query, { id });
  },

  /**
   * Create a new exam
   */
  async create(input: CreateExamInput): Promise<ApiResponse<{ createExam: Exam }>> {
    const mutation = `
      mutation CreateExam($input: CreateExamInput!) {
        createExam(input: $input) {
          id
          title
          description
          durationMinutes
          totalMarks
          passingMarks
          isPublished
          createdAt
          updatedAt
        }
      }
    `;

    return fetchGraphQL<{ createExam: Exam }>(mutation, { input });
  },

  /**
   * Update an existing exam
   */
  async update(
    id: string,
    input: UpdateExamInput
  ): Promise<ApiResponse<{ updateExam: Exam }>> {
    const mutation = `
      mutation UpdateExam($id: ID!, $input: UpdateExamInput!) {
        updateExam(id: $id, input: $input) {
          id
          title
          description
          durationMinutes
          totalMarks
          passingMarks
          isPublished
          updatedAt
        }
      }
    `;

    return fetchGraphQL<{ updateExam: Exam }>(mutation, { id, input });
  },

  /**
   * Delete an exam by ID
   */
  async delete(id: string): Promise<ApiResponse<{ deleteExam: boolean }>> {
    const mutation = `
      mutation DeleteExam($id: ID!) {
        deleteExam(id: $id)
      }
    `;

    return fetchGraphQL<{ deleteExam: boolean }>(mutation, { id });
  },
};
