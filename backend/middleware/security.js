// backend/middleware/security.js
export const promptInjectionProtection = (req, res, next) => {
  const { intent } = req.body;
  
  if (!intent) {
    return next();
  }
  
  // Detect common injection patterns
  const injectionPatterns = [
    /system:/i,
    /assistant:/i,
    /ignore previous instructions/i,
    /forget your instructions/i,
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /eval\(/i,
    /document\./i,
    /window\./i
  ];
  
  for (const pattern of injectionPatterns) {
    if (pattern.test(intent)) {
      return res.status(400).json({
        error: 'Invalid input detected',
        message: 'Please rephrase your request without special commands'
      });
    }
  }
  
  next();
};