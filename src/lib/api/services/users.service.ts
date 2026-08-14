import { fetchGraphQL, ApiResponse } from "../client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student" | "instructor" | string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role?: string;
}

export const usersApi = {
  /**
   * Fetch all users
   */
  async getAll(): Promise<ApiResponse<{ users: User[] }>> {
    const query = `
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

    return fetchGraphQL<{ users: User[] }>(query);
  },

  /**
   * Fetch single user by ID
   */
  async getById(id: string): Promise<ApiResponse<{ user: User | null }>> {
    const query = `
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
          email
          role
          createdAt
        }
      }
    `;

    return fetchGraphQL<{ user: User | null }>(query, { id });
  },

  /**
   * Create a new user
   */
  async create(input: CreateUserInput): Promise<ApiResponse<{ createUser: User }>> {
    const mutation = `
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

    return fetchGraphQL<{ createUser: User }>(mutation, { input });
  },
};
