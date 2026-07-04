import { connectDB } from "@/lib/db";
import { addressRepository } from "@/repositories/address.repository";
import { success, error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
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
    await connectDB();

    const count = await addressRepository.countByUser(userId);
    const cleaned = sanitize(data);

    if (count === 0) {
      cleaned.isDefault = true;
    }

    if (cleaned.isDefault === true) {
      await addressRepository.clearDefault(userId);
    }

    const address = await addressRepository.create(userId, cleaned);
    return success(address, MESSAGES.ADDRESS_CREATED);
  },

  async update(
    userId: string,
    addressId: string,
    data: Record<string, unknown>,
  ): Promise<ApiResponse<IAddress>> {
    await connectDB();

    const existing = await addressRepository.getById(userId, addressId);
    if (!existing) {
      return error(MESSAGES.ADDRESS_NOT_FOUND);
    }

    const cleaned = sanitize(data);

    if (cleaned.isDefault === true) {
      await addressRepository.clearDefault(userId);
    }

    const updated = await addressRepository.update(userId, addressId, cleaned);
    if (!updated) {
      return error(MESSAGES.ADDRESS_NOT_FOUND);
    }

    return success(updated, MESSAGES.ADDRESS_UPDATED);
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
