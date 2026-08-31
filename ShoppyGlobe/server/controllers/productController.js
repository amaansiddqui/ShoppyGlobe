import Product from "../models/Product.js";
import { ApiError } from "../middleware/validate.js";

/**
 * GET /api/products
 * Fetch a list of products from MongoDB.
 */
export async function getProducts(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    // filter by Category
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      const rx = new RegExp(req.query.search, "i");
      filter.$or = [{ title: rx }, { description: rx }, { brand: rx }];
    }

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
}

/**
 * GET /api/products/:id
 * Fetch details of a single product by its ID.
 */
export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).lean();
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
}

/**
 * POST /api/products
 * Create a new product in MongoDB.
 */
export async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    res.status(500).json({ message: "Failed to create product", error: err.message });
  }
}

/**
 * PUT /api/products/:id
 * Update an existing product in MongoDB.
 */
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;

    const updates = { ...req.body };

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
}

/**
 * DELETE /api/products/:id
 * Delete a product from MongoDB.
 */
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    res.json({ message: "Product deleted", product });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
}

/**
 * GET /api/products/category-list 
 * Distinct product categories from MongoDB.
 */
export async function getCategoryList(_req, res) {
  try {
    const categories = await Product.distinct("category");
    res.json(categories.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories", error: err.message });
  }
}
