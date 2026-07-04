import { Address, IAddress } from "@/models";

export const addressRepository = {
  async getAll(userId: string): Promise<IAddress[]> {
    return Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
  },

  async getById(userId: string, addressId: string): Promise<IAddress | null> {
    return Address.findOne({ _id: addressId, user: userId });
  },

  async create(userId: string, data: Record<string, unknown>): Promise<IAddress> {
    return Address.create({ ...data, user: userId });
  },

  async update(userId: string, addressId: string, data: Record<string, unknown>): Promise<IAddress | null> {
    return Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      { $set: data },
      { new: true, runValidators: true },
    );
  },

  async delete(userId: string, addressId: string): Promise<IAddress | null> {
    return Address.findOneAndDelete({ _id: addressId, user: userId });
  },

  async setDefault(userId: string, addressId: string): Promise<void> {
    await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
    await Address.updateOne({ _id: addressId, user: userId }, { $set: { isDefault: true } });
  },

  async clearDefault(userId: string): Promise<void> {
    await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
  },

  async countByUser(userId: string): Promise<number> {
    return Address.countDocuments({ user: userId });
  },

  async findOldest(userId: string): Promise<IAddress | null> {
    return Address.findOne({ user: userId }).sort({ createdAt: 1 });
  },
};
