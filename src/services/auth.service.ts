import { connectDB } from "@/lib/db";
import { hashPassword, comparePassword, generateAccessToken } from "@/lib/auth";
import { userRepository } from "@/repositories/user.repository";
import { success, error } from "@/lib/api-response";
import type { ApiResponse } from "@/types/common";
import type { RegisterInput, LoginInput } from "@/validations";

type AuthResult = {
  user: { id: string; name: string; email: string; role: string };
  token: string;
};

export const authService = {
  async register(data: RegisterInput): Promise<ApiResponse<AuthResult>> {
    await connectDB();

    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      return error("Email already registered");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await userRepository.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const token = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return success(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      "Registration successful",
    );
  },

  async login(data: LoginInput): Promise<ApiResponse<AuthResult>> {
    await connectDB();

    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      return error("Invalid email or password");
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
      return error("Invalid email or password");
    }

    const token = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return success(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      "Login successful",
    );
  },

  async logout(): Promise<ApiResponse<null>> {
    return success(null, "Logged out successfully");
  },
};
