import { Category, ICategory } from "@/models";

export type CreateCategoryData = {
  name: string;
  slug: string;
  image: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type UpdateCategoryData = Partial<CreateCategoryData>;

export const categoryRepository = {
  async create(data: CreateCategoryData): Promise<ICategory> {
    return Category.create(data);
  },

  async update(id: string, data: UpdateCategoryData): Promise<ICategory | null> {
    return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id: string): Promise<ICategory | null> {
    return Category.findByIdAndDelete(id);
  },

  async findById(id: string): Promise<ICategory | null> {
    return Category.findById(id);
  },

  async findBySlug(slug: string): Promise<ICategory | null> {
    return Category.findOne({ slug });
  },

  async findAll(query: {
    page: number;
    limit: number;
    skip: number;
    search: string;
    sort: Record<string, 1 | -1>;
  }): Promise<{ categories: ICategory[]; total: number }> {
    const filter: Record<string, unknown> = {};

    if (query.search) {
      filter.name = { $regex: query.search, $options: "i" };
    }

    const [categories, total] = await Promise.all([
      Category.find(filter)
        .sort(query.sort)
        .skip(query.skip)
        .limit(query.limit),
      Category.countDocuments(filter),
    ]);

    return { categories, total };
  },

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await Category.countDocuments({ slug });
    return count > 0;
  },

  async count(): Promise<number> {
    return Category.countDocuments();
  },

  async findActive(): Promise<ICategory[]> {
    return Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
  },
};
