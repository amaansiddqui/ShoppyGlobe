import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import process from "process";


const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shoppyglobe";

try {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Fetch products from DummyJSON (paginated to get all ~194)
  let allProducts = [];
  for (let skip = 0; ; skip += 100) {
    const res = await fetch(`https://dummyjson.com/products?limit=100&skip=${skip}`);
    if (!res.ok) throw new Error(`DummyJSON request failed (${res.status})`);
    const data = await res.json();
    allProducts = allProducts.concat(data.products);
    if (skip + 100 >= data.total) break;
  }
  console.log(`Fetched ${allProducts.length} products from DummyJSON`);

  // Replace existing collection content
  await Product.deleteMany({});
  // Strip DummyJSON ids so MongoDB generates proper ObjectIds
  const docs = allProducts.map(({ ...rest }) => rest);
  await Product.insertMany(docs);

  console.log(`Seeded ${docs.length} products into MongoDB`);
  process.exit(0);
} catch (err) {
  console.error("Seed failed:", err.message);
  process.exit(1);
}
