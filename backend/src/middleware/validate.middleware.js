const { z } = require('zod')

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({ ...req.params, ...req.query, ...req.body })
    next()
  } catch (error) {
    return res.status(400).json({ error: 'Validation failed', details: error.errors })
  }
}

module.exports = { validate }
