import { User, IUser } from "@/models";

export const userRepository = {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  },

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  },

  async create(
    data: Partial<Pick<IUser, "name" | "email" | "password">>,
  ): Promise<IUser> {
    return User.create(data);
  },
};
