import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import expensesRouter from './routes/expenses.js'
import categoriesRouter from './routes/categories.js'
import summaryRouter from './routes/summary.js'
import chartsRouter from './routes/charts.js'

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

app.use('/api/expenses', expensesRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/summary', summaryRouter)
app.use('/api/charts', chartsRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
