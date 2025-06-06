import Income from "../models/Income.js";

export const createIncome = async (req, res) => {
  try {
    const { amount, source, note, date } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Miqdor musbat son bo'lishi kerak" });
    }

    if (!source || source.trim() === "") {
      return res
        .status(400)
        .json({ error: "Daromad manbai kiritilishi shart" });
    }

    const income = new Income({
      userId: req.user.id,
      amount: Number.parseFloat(amount),
      source: source.trim(),
      note: note?.trim() || "",
      date: date ? new Date(date) : new Date(),
    });

    await income.save();
    res.status(201).json(income);
  } catch (err) {
    console.error("Income creation error:", err);
    res.status(500).json({ error: "Daromad yaratishda xatolik" });
  }
};

export const getIncomes = async (req, res) => {
  try {
    const { page = 1, limit = 10, source, startDate, endDate } = req.query;

    const query = { userId: req.user.id };

    if (source) {
      query.source = new RegExp(source, "i");
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const incomes = await Income.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Income.countDocuments(query);

    res.json({
      incomes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (err) {
    console.error("Get incomes error:", err);
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
    console.error("Get income by ID error:", err);
    res.status(500).json({ error: "Daromadni olishda xatolik" });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const { amount, source, note, date } = req.body;

    const updateData = {};
    if (amount !== undefined) {
      if (amount <= 0) {
        return res
          .status(400)
          .json({ error: "Miqdor musbat son bo'lishi kerak" });
      }
      updateData.amount = Number.parseFloat(amount);
    }
    if (source !== undefined) {
      if (!source.trim()) {
        return res
          .status(400)
          .json({ error: "Daromad manbai kiritilishi shart" });
      }
      updateData.source = source.trim();
    }
    if (note !== undefined) updateData.note = note.trim();
    if (date !== undefined) updateData.date = new Date(date);

    const updated = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      {
        new: true,
      }
    );

    if (!updated) return res.status(404).json({ error: "Daromad topilmadi" });
    res.json(updated);
  } catch (err) {
    console.error("Update income error:", err);
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
    res.json({ message: "Daromad o'chirildi" });
  } catch (err) {
    console.error("Delete income error:", err);
    res.status(500).json({ error: "Daromadni o'chirishda xatolik" });
  }
};
