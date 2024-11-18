import { Router } from "express";
import { client, db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");

  //ดึงข้อมูลสินค้าทั้งหมดจาก MongoDB
  const products = await collection.find().toArray();

  // ส่งข้อมูลกลับในรูปแบบ JSON
  return res.status(200).json({ data: products });
});

productRouter.get("/:id", (req, res) => {});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");

  const productData = { ...req.body };
  await collection.insertOne(productData);

  return res.json({
    message: `Product has been created successfully`,
  });
});

productRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");

    // รับค่า productId จาก URL parameter
    const productId = req.params.id;

    // ตรวจสอบว่า productId เป็น ObjectId ที่ถูกต้องหรือไม่
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // แปลง productId เป็น ObjectId
    const objectId = new ObjectId(productId);

    // รับข้อมูลใหม่จาก Body ของคำขอ
    const updatedData = { ...req.body };

    // อัปเดตสินค้าใน MongoDB
    const result = await collection.updateOne(
      { _id: objectId }, // ใช้ objectId
      { $set: updatedData }
    );

    // ตรวจสอบว่ามีการอัปเดตสำเร็จหรือไม่
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // ส่งข้อความตอบกลับ
    return res
      .status(200)
      .json({ message: "Product has been updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error.message);
    return res.status(500).json({ error: "Failed to update product" });
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");

    // รับค่า productId จาก URL parameter
    const productId = req.params.id;

    // ตรวจสอบว่า productId เป็น ObjectId ที่ถูกต้องหรือไม่
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // แปลง productId เป็น ObjectId
    const objectId = new ObjectId(productId);

    // ลบสินค้าจาก MongoDB
    const result = await collection.deleteOne({ _id: objectId });

    // ตรวจสอบว่ามีสินค้าที่ถูกลบหรือไม่
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // ส่งข้อความตอบกลับ
    return res
      .status(200)
      .json({ message: "Product has been deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    return res.status(500).json({ error: "Failed to delete product" });
  }
});

export default productRouter;
