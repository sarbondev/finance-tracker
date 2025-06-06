import Expense from "../models/Expense.js"
import Income from "../models/Income.js"

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id
    const currentMonth = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    // Current month stats
    const monthlyIncome = await Income.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    // Total stats
    const totalIncome = await Income.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    const totalExpenses = await Expense.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    const monthlyIncomeAmount = monthlyIncome[0]?.total || 0
    const monthlyExpenseAmount = monthlyExpenses[0]?.total || 0
    const totalIncomeAmount = totalIncome[0]?.total || 0
    const totalExpenseAmount = totalExpenses[0]?.total || 0

    res.json({
      monthly: {
        income: monthlyIncomeAmount,
        expenses: monthlyExpenseAmount,
        balance: monthlyIncomeAmount - monthlyExpenseAmount,
      },
      total: {
        income: totalIncomeAmount,
        expenses: totalExpenseAmount,
        balance: totalIncomeAmount - totalExpenseAmount,
      },
    })
  } catch (err) {
    res.status(500).json({ error: "Statistikalarni olishda xatolik" })
  }
}

export const getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.params
    const userId = req.user.id

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const incomes = await Income.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 })

    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 })

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    res.json({
      month: `${year}-${month}`,
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      incomes,
      expenses,
    })
  } catch (err) {
    res.status(500).json({ error: "Oylik hisobotni olishda xatolik" })
  }
}

export const getYearlyReport = async (req, res) => {
  try {
    const { year } = req.params
    const userId = req.user.id

    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)

    const monthlyData = []

    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(year, month, 1)
      const monthEnd = new Date(year, month + 1, 0)

      const monthlyIncome = await Income.aggregate([
        {
          $match: {
            userId: userId,
            date: { $gte: monthStart, $lte: monthEnd },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])

      const monthlyExpenses = await Expense.aggregate([
        {
          $match: {
            userId: userId,
            date: { $gte: monthStart, $lte: monthEnd },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])

      const income = monthlyIncome[0]?.total || 0
      const expenses = monthlyExpenses[0]?.total || 0

      monthlyData.push({
        month: month + 1,
        income,
        expenses,
        balance: income - expenses,
      })
    }

    const yearlyIncome = monthlyData.reduce((sum, month) => sum + month.income, 0)
    const yearlyExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0)

    res.json({
      year,
      totalIncome: yearlyIncome,
      totalExpenses: yearlyExpenses,
      balance: yearlyIncome - yearlyExpenses,
      monthlyData,
    })
  } catch (err) {
    res.status(500).json({ error: "Yillik hisobotni olishda xatolik" })
  }
}

export const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.user.id

    const categoryBreakdown = await Expense.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ])

    const totalExpenses = categoryBreakdown.reduce((sum, cat) => sum + cat.total, 0)

    const categoriesWithPercentage = categoryBreakdown.map((cat) => ({
      category: cat._id,
      total: cat.total,
      count: cat.count,
      percentage: totalExpenses > 0 ? ((cat.total / totalExpenses) * 100).toFixed(2) : 0,
    }))

    res.json({
      totalExpenses,
      categories: categoriesWithPercentage,
    })
  } catch (err) {
    res.status(500).json({ error: "Kategoriya tahlilini olishda xatolik" })
  }
}
