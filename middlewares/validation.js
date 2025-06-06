export const validateExpense = (req, res, next) => {
  const { amount, category } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Miqdor musbat son bo'lishi kerak" });
  }

  if (!category || category.trim() === "") {
    return res.status(400).json({ error: "Kategoriya kiritilishi shart" });
  }

  next();
};

export const validateIncome = (req, res, next) => {
  const { amount, source } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Miqdor musbat son bo'lishi kerak" });
  }

  if (!source || source.trim() === "") {
    return res.status(400).json({ error: "Daromad manbai kiritilishi shart" });
  }

  next();
};

export const validateAuth = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email va parol kiritilishi shart" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email formati noto'g'ri" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" });
  }

  next();
};
