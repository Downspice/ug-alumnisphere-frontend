import { gql } from "@apollo/client";

export const CREATE_EXAM = gql`
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
    }
  }
`;

export const DELETE_EXAM = gql`
  mutation DeleteExam($id: ID!) {
    deleteExam(id: $id)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
      createdAt
    }
  }
`;
