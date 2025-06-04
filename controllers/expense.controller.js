import Expense from "../models/Expense.js";

export const createExpense = async (req, res) => {
  try {
    const { amount, category, note, date } = req.body;
    const expense = new Expense({
      userId: req.user.id,
      amount,
      category,
      note,
      date,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: "Xarajat yaratishda xatolik" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .populate("category")
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Xarajatlarni olishda xatolik" });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("category");
    if (!expense) return res.status(404).json({ error: "Xarajat topilmadi" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: "Xarajatni olishda xatolik" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Xarajat topilmadi" });
    res.json(updated);
  } catch (err) {
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
    res.json({ msg: "Xarajat o'chirildi" });
  } catch (err) {
    res.status(500).json({ error: "Xarajatni o'chirishda xatolik" });
  }
};
