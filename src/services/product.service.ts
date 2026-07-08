import { connectDB } from "@/lib/db";
import { productRepository, type ProductFilter } from "@/repositories/product.repository";
import { categoryRepository } from "@/repositories/category.repository";
import { success, error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { calculatePagination } from "@/lib/pagination";
import { calculateSkip } from "@/lib/query";
import type { ApiResponse, Pagination } from "@/types/common";
import type { CreateProductInput, UpdateProductInput } from "@/validations/product.validation";
import type { IProduct } from "@/models";

type PaginatedProducts = {
  products: IProduct[];
  pagination: Pagination;
};

export const productService = {
  async create(data: CreateProductInput): Promise<ApiResponse<IProduct>> {
    await connectDB();

    const slug = data.slug.toLowerCase().trim();

    const slugExists = await productRepository.existsBySlug(slug);
    if (slugExists) {
      return error(MESSAGES.SLUG_EXISTS);
    }

    const skuExists = await productRepository.existsBySku(data.sku);
    if (skuExists) {
      return error(MESSAGES.SKU_EXISTS);
    }

    const category = await categoryRepository.findById(data.category);
    if (!category) {
      return error(MESSAGES.CATEGORY_INVALID);
    }

    const product = await productRepository.create({
      ...data,
      slug,
      title: data.title.trim(),
      description: data.description,
      shortDescription: data.shortDescription ?? "",
      images: data.images ?? [],
      stock: data.stock ?? 0,
      tags: data.tags ?? [],
      isFeatured: data.isFeatured ?? false,
      isPopular: data.isPopular ?? false,
      isLatest: data.isLatest ?? false,
      isActive: data.isActive ?? true,
    });

    return success(product, MESSAGES.PRODUCT_CREATED);
  },

  async update(id: string, data: UpdateProductInput): Promise<ApiResponse<IProduct>> {
    await connectDB();

    const product = await productRepository.findById(id);
    if (!product) {
      return error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) {
      updateData.title = data.title.trim();
    }
    if (data.slug !== undefined) {
      const slug = data.slug.toLowerCase().trim();
      const slugExists = await productRepository.existsBySlug(slug);
      if (slugExists && slug !== product.slug) {
        return error(MESSAGES.SLUG_EXISTS);
      }
      updateData.slug = slug;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.shortDescription !== undefined) {
      updateData.shortDescription = data.shortDescription;
    }
    if (data.category !== undefined) {
      const category = await categoryRepository.findById(data.category);
      if (!category) {
        return error(MESSAGES.CATEGORY_INVALID);
      }
      updateData.category = data.category;
    }
    if (data.images !== undefined) {
      updateData.images = data.images;
    }
    if (data.price !== undefined) {
      updateData.price = data.price;
    }
    if (data.discountPrice !== undefined) {
      updateData.discountPrice = data.discountPrice;
    }
    if (data.stock !== undefined) {
      updateData.stock = data.stock;
    }
    if (data.sku !== undefined) {
      const skuExists = await productRepository.existsBySku(data.sku);
      if (skuExists && data.sku !== product.sku) {
        return error(MESSAGES.SKU_EXISTS);
      }
      updateData.sku = data.sku;
    }
    if (data.brand !== undefined) {
      updateData.brand = data.brand;
    }
    if (data.isFeatured !== undefined) {
      updateData.isFeatured = data.isFeatured;
    }
    if (data.isPopular !== undefined) {
      updateData.isPopular = data.isPopular;
    }
    if (data.isLatest !== undefined) {
      updateData.isLatest = data.isLatest;
    }
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }
    if (data.tags !== undefined) {
      updateData.tags = data.tags;
    }

    const updated = await productRepository.update(id, updateData);
    if (!updated) {
      return error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    return success(updated, MESSAGES.PRODUCT_UPDATED);
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    await connectDB();

    const product = await productRepository.findById(id);
    if (!product) {
      return error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    await productRepository.delete(id);
    return success(null, MESSAGES.PRODUCT_DELETED);
  },

  async findById(id: string): Promise<ApiResponse<IProduct>> {
    await connectDB();

    const product = await productRepository.findById(id);
    if (!product) {
      return error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    return success(product, MESSAGES.PRODUCT_FETCHED);
  },

  async findAll(raw: {
    page: number;
    limit: number;
    search: string;
    sort: Record<string, 1 | -1>;
    category?: string;
    isFeatured?: boolean;
    isPopular?: boolean;
    isLatest?: boolean;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
  }): Promise<ApiResponse<PaginatedProducts>> {
    await connectDB();

    const skip = calculateSkip(raw.page, raw.limit);

    const filter: ProductFilter = {
      page: raw.page,
      limit: raw.limit,
      skip,
      search: raw.search,
      sort: raw.sort,
    };

    if (raw.category) filter.category = raw.category;
    if (raw.isFeatured !== undefined) filter.isFeatured = raw.isFeatured;
    if (raw.isPopular !== undefined) filter.isPopular = raw.isPopular;
    if (raw.isLatest !== undefined) filter.isLatest = raw.isLatest;
    if (raw.isActive !== undefined) filter.isActive = raw.isActive;
    if (raw.minPrice !== undefined) filter.minPrice = raw.minPrice;
    if (raw.maxPrice !== undefined) filter.maxPrice = raw.maxPrice;
    if (raw.minRating !== undefined) filter.minRating = raw.minRating;

    const { products, total } = await productRepository.findAll(filter);

    const pagination = calculatePagination({ page: raw.page, limit: raw.limit, total });

    return success({ products, pagination }, MESSAGES.PRODUCTS_FETCHED);
  },
};
