import { connectDB } from "@/lib/db";
import { addressRepository } from "@/repositories/address.repository";
import { success, error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { Address } from "@/models";
import type { ApiResponse } from "@/types/common";
import type { IAddress } from "@/models";

function sanitize(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      out[key] = typeof val === "string" ? val.trim() : val;
    }
  }
  return out;
}

export const addressService = {
  async getAll(userId: string): Promise<ApiResponse<IAddress[]>> {
    await connectDB();
    const addresses = await addressRepository.getAll(userId);
    return success(addresses, MESSAGES.ADDRESSES_FETCHED);
  },

  async create(
    userId: string,
    data: Record<string, unknown>,
  ): Promise<ApiResponse<IAddress>> {
    const mongooseInstance = await connectDB();

    const count = await addressRepository.countByUser(userId);
    const cleaned = sanitize(data);

    if (count === 0) {
      cleaned.isDefault = true;
    }

    const session = await mongooseInstance.startSession();
    session.startTransaction();

    try {
      if (cleaned.isDefault === true) {
        await Address.updateMany(
          { user: userId },
          { $set: { isDefault: false } },
          { session },
        );
      }

      const [address] = await Address.create(
        [{ ...cleaned, user: userId }],
        { session },
      );

      await session.commitTransaction();
      return success(address, MESSAGES.ADDRESS_CREATED);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  async update(
    userId: string,
    addressId: string,
    data: Record<string, unknown>,
  ): Promise<ApiResponse<IAddress>> {
    const mongooseInstance = await connectDB();

    const existing = await addressRepository.getById(userId, addressId);
    if (!existing) {
      return error(MESSAGES.ADDRESS_NOT_FOUND);
    }

    const cleaned = sanitize(data);

    const session = await mongooseInstance.startSession();
    session.startTransaction();

    try {
      if (cleaned.isDefault === true) {
        await Address.updateMany(
          { user: userId, _id: { $ne: addressId } },
          { $set: { isDefault: false } },
          { session },
        );
      }

      const updated = await Address.findOneAndUpdate(
        { _id: addressId, user: userId },
        { $set: cleaned },
        { new: true, session },
      );

      await session.commitTransaction();

      if (!updated) {
        return error(MESSAGES.ADDRESS_NOT_FOUND);
      }

      return success(updated, MESSAGES.ADDRESS_UPDATED);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  async delete(userId: string, addressId: string): Promise<ApiResponse<null>> {
    await connectDB();

    const existing = await addressRepository.getById(userId, addressId);
    if (!existing) {
      return error(MESSAGES.ADDRESS_NOT_FOUND);
    }

    const wasDefault = existing.isDefault;

    await addressRepository.delete(userId, addressId);

    if (wasDefault) {
      const remaining = await addressRepository.countByUser(userId);
      if (remaining > 0) {
        const oldest = await addressRepository.findOldest(userId);
        if (oldest) {
          await addressRepository.setDefault(userId, oldest._id.toString());
        }
      }
    }

    return success(null, MESSAGES.ADDRESS_DELETED);
  },

  async setDefault(
    userId: string,
    addressId: string,
  ): Promise<ApiResponse<IAddress>> {
    await connectDB();

    const existing = await addressRepository.getById(userId, addressId);
    if (!existing) {
      return error(MESSAGES.ADDRESS_NOT_FOUND);
    }

    await addressRepository.setDefault(userId, addressId);

    const updated = await addressRepository.getById(userId, addressId);
    return success(updated!, MESSAGES.ADDRESS_DEFAULT_UPDATED);
  },
};
