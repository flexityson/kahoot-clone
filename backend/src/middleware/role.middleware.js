function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // Handle both string roles and uppercase comparison
    const userRole = req.user.role?.toUpperCase?.() || req.user.role
    const required = requiredRole.toUpperCase?.() || requiredRole

    if (userRole !== required) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}

module.exports = roleMiddleware