import { fetchGraphQL, fetchRest, ApiResponse } from "../client";

export interface HealthStatus {
  status: string;
  timestamp: string;
  database: string;
  uptime: number;
}

export interface RestHealthResponse {
  status: string;
  uptime: number;
  timestamp: string;
}

export const healthApi = {
  /**
   * Fetch health status via GraphQL
   */
  async getGraphQLHealth(): Promise<ApiResponse<{ health: HealthStatus }>> {
    const query = `
      query GetHealth {
        health {
          status
          timestamp
          database
          uptime
        }
      }
    `;

    return fetchGraphQL<{ health: HealthStatus }>(query);
  },

  /**
   * Fetch health status via REST endpoint
   */
  async getRestHealth(): Promise<ApiResponse<RestHealthResponse>> {
    return fetchRest<RestHealthResponse>("/health");
  },
};
