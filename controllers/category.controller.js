import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ error: "Kategoriya nomi kiritilishi shart" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Bu kategoriya allaqachon mavjud" });
    }

    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: "Kategoriya yaratishda xatolik" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Kategoriyalarni olishda xatolik" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ error: "Kategoriya topilmadi" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Kategoriyani yangilashda xatolik" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Kategoriya topilmadi" });
    res.json({ message: "Kategoriya o'chirildi" });
  } catch (err) {
    res.status(500).json({ error: "Kategoriyani o'chirishda xatolik" });
  }
};
