import Expense from "../models/Expense.js";

export const createExpense = async (req, res) => {
  try {
    const { amount, category, note, date } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Miqdor musbat son bo'lishi kerak" });
    }

    if (!category || category.trim() === "") {
      return res.status(400).json({ error: "Kategoriya kiritilishi shart" });
    }

    const expense = new Expense({
      userId: req.user.id,
      amount: Number.parseFloat(amount),
      category: category.trim(),
      note: note?.trim() || "",
      date: date ? new Date(date) : new Date(),
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error("Expense creation error:", err);
    res.status(500).json({ error: "Xarajat yaratishda xatolik" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;

    const query = { userId: req.user.id };

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Expense.countDocuments(query);

    res.json({
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (err) {
    console.error("Get expenses error:", err);
    res.status(500).json({ error: "Xarajatlarni olishda xatolik" });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!expense) return res.status(404).json({ error: "Xarajat topilmadi" });
    res.json(expense);
  } catch (err) {
    console.error("Get expense by ID error:", err);
    res.status(500).json({ error: "Xarajatni olishda xatolik" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { amount, category, note, date } = req.body;

    const updateData = {};
    if (amount !== undefined) {
      if (amount <= 0) {
        return res
          .status(400)
          .json({ error: "Miqdor musbat son bo'lishi kerak" });
      }
      updateData.amount = Number.parseFloat(amount);
    }
    if (category !== undefined) {
      if (!category.trim()) {
        return res.status(400).json({ error: "Kategoriya kiritilishi shart" });
      }
      updateData.category = category.trim();
    }
    if (note !== undefined) updateData.note = note.trim();
    if (date !== undefined) updateData.date = new Date(date);

    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      {
        new: true,
      }
    );

    if (!updated) return res.status(404).json({ error: "Xarajat topilmadi" });
    res.json(updated);
  } catch (err) {
    console.error("Update expense error:", err);
    res.status(500).json({ error: "Xarajatni yangilashda xatolik" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ error: "Xarajat topilmadi" });
    res.json({ message: "Xarajat o'chirildi" });
  } catch (err) {
    console.error("Delete expense error:", err);
    res.status(500).json({ error: "Xarajatni o'chirishda xatolik" });
  }
};
