// backend/middleware/validation.js
import { z } from 'zod';

const intentSchema = z.object({
  intent: z.string()
    .min(1, 'Intent cannot be empty')
    .max(500, 'Intent too long (max 500 characters)')
    .trim(),
  parentId: z.string().uuid().optional(),
  versionId: z.string().uuid().optional()
});

export const validateIntent = (req, res, next) => {
  try {
    const validated = intentSchema.parse(req.body);
    req.body = validated;
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
};

export const validateComponent = (component) => {
  const allowedComponents = [
    'Button', 'Card', 'Input', 'Table', 
    'Modal', 'Sidebar', 'Navbar', 'Chart'
  ];
  
  return allowedComponents.includes(component.type);
};