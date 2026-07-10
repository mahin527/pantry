import { Address, IAddress } from "@/models";

// Whitelist of allowed fields for Address to prevent NoSQL injection
const ALLOWED_ADDRESS_FIELDS = [
  "fullName",
  "phone",
  "country",
  "city",
  "area",
  "street",
  "postalCode",
  "label",
  "isDefault",
] as const;

/**
 * Sanitize address data by only allowing fields from the whitelist.
 * This prevents NoSQL operator injection via $ne, $where, $regex, etc.
 */
const sanitizeAddressData = (data: Record<string, unknown>): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};
  for (const key of ALLOWED_ADDRESS_FIELDS) {
    if (data[key] !== undefined) {
      sanitized[key] = data[key];
    }
  }
  return sanitized;
};

export const addressRepository = {
  async getAll(userId: string): Promise<IAddress[]> {
    return Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
  },

  async getById(userId: string, addressId: string): Promise<IAddress | null> {
    return Address.findOne({ _id: addressId, user: userId });
  },

  async create(userId: string, data: Record<string, unknown>): Promise<IAddress> {
    const sanitizedData = sanitizeAddressData(data);

    if (sanitizedData.isDefault) {
      await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
    }

    return Address.create({ ...sanitizedData, user: userId });
  },

  async update(userId: string, addressId: string, data: Record<string, unknown>): Promise<IAddress | null> {
    const sanitizedData = sanitizeAddressData(data);

    return Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      { $set: sanitizedData },
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
