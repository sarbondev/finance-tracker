import Income from "../models/Income.js";

export const createIncome = async (req, res) => {
  try {
    const { amount, source, note, date } = req.body;
    const income = new Income({
      userId: req.user.id,
      amount,
      source,
      note,
      date,
    });
    await income.save();
    res.status(201).json(income);
  } catch (err) {
    res.status(500).json({ error: "Daromad yaratishda xatolik" });
  }
};

export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.id })
      .sort({
        date: -1,
      })
      .lean();
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ error: "Daromadlarni olishda xatolik" });
  }
};

export const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!income) return res.status(404).json({ error: "Daromad topilmadi" });
    res.json(income);
  } catch (err) {
    res.status(500).json({ error: "Daromadni olishda xatolik" });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const updated = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Daromad topilmadi" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Daromadni yangilashda xatolik" });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const deleted = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ error: "Daromad topilmadi" });
    res.json({ msg: "Daromad o'chirildi" });
  } catch (err) {
    res.status(500).json({ error: "Daromadni o'chirishda xatolik" });
  }
};
