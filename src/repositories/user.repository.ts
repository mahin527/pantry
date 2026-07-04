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

  async count(): Promise<number> {
    return User.countDocuments();
  },

  async findLatest(limit: number): Promise<IUser[]> {
    return User.find().sort({ createdAt: -1 }).limit(limit).select("name email avatar createdAt role");
  },
};
