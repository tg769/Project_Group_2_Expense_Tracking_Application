import express from 'express'
import pool from '../db.js'

const router = express.Router()

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, is_custom FROM categories ORDER BY id')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not load categories.' })
  }
})

// POST /api/categories (adds a custom tag)
router.post('/', async (req, res) => {
  const body = req.body || {}
  const name = (body.name || '').trim()
  if (!name) {
    return res.status(400).json({ error: 'Enter a tag name.' })
  }

  try {
    const existing = await pool.query('SELECT id FROM categories WHERE LOWER(name) = LOWER($1)', [name])
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'That category already exists.' })
    }

    const result = await pool.query(
      'INSERT INTO categories (name, is_custom) VALUES ($1, true) RETURNING id, name, is_custom',
      [name],
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not add the category.' })
  }
})

export default router
