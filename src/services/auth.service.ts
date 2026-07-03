import { connectDB } from "@/lib/db";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  verifyAccessToken,
  type TokenPayload,
} from "@/lib/auth";
import { userRepository } from "@/repositories/user.repository";
import { success, error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import type { ApiResponse } from "@/types/common";
import type { RegisterInput, LoginInput } from "@/validations";

type AuthResult = {
  user: { id: string; name: string; email: string; role: string };
  token: string;
};

type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
};

function toSafeUser(user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
}): SafeUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

export const authService = {
  async register(data: RegisterInput): Promise<ApiResponse<AuthResult>> {
    await connectDB();

    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      return error(MESSAGES.EMAIL_EXISTS);
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
        user: toSafeUser(user),
        token,
      },
      MESSAGES.REGISTER_SUCCESS,
    );
  },

  async login(data: LoginInput): Promise<ApiResponse<AuthResult>> {
    await connectDB();

    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      return error(MESSAGES.INVALID_CREDENTIALS);
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
      return error(MESSAGES.INVALID_CREDENTIALS);
    }

    const token = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return success(
      {
        user: toSafeUser(user),
        token,
      },
      MESSAGES.LOGIN_SUCCESS,
    );
  },

  async logout(): Promise<ApiResponse<null>> {
    return success(null, MESSAGES.LOGOUT_SUCCESS);
  },

  async getCurrentUser(token: string): Promise<ApiResponse<SafeUser>> {
    let payload: TokenPayload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      return error(MESSAGES.INVALID_TOKEN, "Unauthorized");
    }

    await connectDB();

    const user = await userRepository.findById(payload.userId);
    if (!user) {
      return error(MESSAGES.USER_NOT_FOUND, "Unauthorized");
    }

    return success(toSafeUser(user), MESSAGES.USER_FETCHED);
  },
};
