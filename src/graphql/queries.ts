import { gql } from "@apollo/client";

export const GET_HEALTH = gql`
  query GetHealth {
    health {
      status
      timestamp
      database
      uptime
    }
  }
`;

export const GET_EXAMS = gql`
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

export const GET_EXAM = gql`
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

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      createdAt
    }
  }
`;
