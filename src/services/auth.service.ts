import type { ApiResponse } from "@/types/common";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthResult = {
  user: { id: string; name: string; email: string; role: string };
  token: string;
};

export const authService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async register(_data: RegisterInput): Promise<ApiResponse<AuthResult>> {
    throw new Error("Not implemented");
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(_data: LoginInput): Promise<ApiResponse<AuthResult>> {
    throw new Error("Not implemented");
  },

  async logout(): Promise<ApiResponse<null>> {
    throw new Error("Not implemented");
  },
};
