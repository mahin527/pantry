import { Product, IProduct } from "@/models";

export type CreateProductData = {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  images?: string[];
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  brand?: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  isLatest?: boolean;
  isActive?: boolean;
  tags?: string[];
};

export type UpdateProductData = Partial<CreateProductData>;

export type ProductFilter = {
  page: number;
  limit: number;
  skip: number;
  search: string;
  sort: Record<string, 1 | -1>;
  category?: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  isLatest?: boolean;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

export const productRepository = {
  async create(data: CreateProductData): Promise<IProduct> {
    return Product.create(data);
  },

  async update(id: string, data: UpdateProductData): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id: string): Promise<IProduct | null> {
    return Product.findByIdAndDelete(id);
  },

  async findById(id: string): Promise<IProduct | null> {
    return Product.findById(id).populate("category", "_id name slug");
  },

  async findBySlug(slug: string): Promise<IProduct | null> {
    return Product.findOne({ slug }).populate("category", "_id name slug");
  },

  async findAll(filter: ProductFilter): Promise<{ products: IProduct[]; total: number }> {
    const query: Record<string, unknown> = {};

    if (filter.search) {
      query.title = { $regex: filter.search, $options: "i" };
    }
    if (filter.category) {
      query.category = filter.category;
    }
    if (filter.isFeatured !== undefined) {
      query.isFeatured = filter.isFeatured;
    }
    if (filter.isPopular !== undefined) {
      query.isPopular = filter.isPopular;
    }
    if (filter.isLatest !== undefined) {
      query.isLatest = filter.isLatest;
    }
    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive;
    }
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      query.price = {};
      if (filter.minPrice !== undefined) {
        (query.price as Record<string, number>).$gte = filter.minPrice;
      }
      if (filter.maxPrice !== undefined) {
        (query.price as Record<string, number>).$lte = filter.maxPrice;
      }
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "_id name slug")
        .sort(filter.sort)
        .skip(filter.skip)
        .limit(filter.limit),
      Product.countDocuments(query),
    ]);

    return { products, total };
  },

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await Product.countDocuments({ slug });
    return count > 0;
  },

  async existsBySku(sku: string): Promise<boolean> {
    const count = await Product.countDocuments({ sku });
    return count > 0;
  },
};
