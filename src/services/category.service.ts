import { connectDB } from "@/lib/db";
import { categoryRepository } from "@/repositories/category.repository";
import { success, error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { calculatePagination } from "@/lib/pagination";
import { calculateSkip } from "@/lib/query";
import type { ApiResponse } from "@/types/common";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/validations/category.validation";
import type { ICategory } from "@/models";

type PaginatedCategories = {
  categories: ICategory[];
  pagination: ReturnType<typeof calculatePagination>;
};

export const categoryService = {
  async create(data: CreateCategoryInput): Promise<ApiResponse<ICategory>> {
    await connectDB();

    const slug = data.slug.toLowerCase().trim();

    const slugExists = await categoryRepository.existsBySlug(slug);
    if (slugExists) {
      return error(MESSAGES.SLUG_EXISTS);
    }

    const category = await categoryRepository.create({
      ...data,
      slug,
      name: data.name.trim(),
      image: data.image ?? "",
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    });

    return success(category, MESSAGES.CATEGORY_CREATED);
  },

  async update(
    id: string,
    data: UpdateCategoryInput,
  ): Promise<ApiResponse<ICategory>> {
    await connectDB();

    const category = await categoryRepository.findById(id);
    if (!category) {
      return error(MESSAGES.CATEGORY_NOT_FOUND);
    }

    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) {
      updateData.name = data.name.trim();
    }
    if (data.slug !== undefined) {
      const slug = data.slug.toLowerCase().trim();
      const slugExists = await categoryRepository.existsBySlug(slug);
      if (slugExists && slug !== category.slug) {
        return error(MESSAGES.SLUG_EXISTS);
      }
      updateData.slug = slug;
    }
    if (data.image !== undefined) {
      updateData.image = data.image;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.sortOrder !== undefined) {
      updateData.sortOrder = data.sortOrder;
    }
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    const updated = await categoryRepository.update(id, updateData);
    if (!updated) {
      return error(MESSAGES.CATEGORY_NOT_FOUND);
    }

    return success(updated, MESSAGES.CATEGORY_UPDATED);
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    await connectDB();

    const category = await categoryRepository.findById(id);
    if (!category) {
      return error(MESSAGES.CATEGORY_NOT_FOUND);
    }

    await categoryRepository.delete(id);
    return success(null, MESSAGES.CATEGORY_DELETED);
  },

  async findById(id: string): Promise<ApiResponse<ICategory>> {
    await connectDB();

    const category = await categoryRepository.findById(id);
    if (!category) {
      return error(MESSAGES.CATEGORY_NOT_FOUND);
    }

    return success(category, MESSAGES.CATEGORY_FETCHED);
  },

  async findAll(query: {
    page: number;
    limit: number;
    search: string;
    sort: Record<string, 1 | -1>;
  }): Promise<ApiResponse<PaginatedCategories>> {
    await connectDB();

    const skip = calculateSkip(query.page, query.limit);

    const { categories, total } = await categoryRepository.findAll({
      ...query,
      skip,
    });

    const pagination = calculatePagination({ page: query.page, limit: query.limit, total });

    return success({ categories, pagination }, MESSAGES.CATEGORIES_FETCHED);
  },
};
