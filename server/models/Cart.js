import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    // Reference to the Product in the products collection
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    // Simple single-user cart for this assignment, userId allows multi-user carts later
    userId: { type: String, default: "guest", index: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// Virtual: computed total price of the cart (requires populated products)
cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce(
    (sum, item) => sum + (item.product ? item.product.price * item.quantity : 0),
    0
  );
});

cartSchema.set("toJSON", { virtuals: true });
cartSchema.set("toObject", { virtuals: true });

export default mongoose.model("Cart", cartSchema);
