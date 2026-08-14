import { examsApi } from "./services/exams.service";
import { usersApi } from "./services/users.service";
import { healthApi } from "./services/health.service";

export * from "./client";
export * from "./services";

export const api = {
  exams: examsApi,
  users: usersApi,
  health: healthApi,
};
