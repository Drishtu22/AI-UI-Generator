import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ComponentValidator } from '../validation/ComponentValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '../.env') });

// PROMPT TEMPLATE - Optimized for UI generation
const PLANNER_PROMPT = `You are a UI planner that creates React component structures. 
You MUST ONLY use components from this FIXED library:

ALLOWED COMPONENTS (NO OTHERS):
- Button (props: variant: "primary"|"secondary"|"outline"|"ghost", size: "sm"|"md"|"lg", children)
- Card (props: title, children, footer)
- Input (props: type: "text"|"email"|"password"|"number", label, placeholder)
- Table (props: columns: array of {key, label}, data: array of objects)
- Modal (props: title, isOpen, onClose, children)
- Sidebar (props: items: array of {label, icon, onClick})
- Navbar (props: brand, links: array of {label, href})
- Chart (props: type: "bar"|"line"|"pie", data: array of {label, value}, title)

USER REQUEST: {userIntent}

PREVIOUS UI: {previousContext}

Generate a JSON structure for this UI.
Be creative and follow the user's request exactly.
Output ONLY valid JSON with no explanation.

{
  "layout": "single" | "split" | "sidebar-main" | "modal-overlay",
  "components": [
    {
      "type": "ComponentName",
      "props": {},
      "children": []
    }
  ],
  "composition": "description"
}`;

export class Planner {
  constructor() {
    console.log('🧠 Planner: Initializing with Gemini API');
    
    // Check for Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('❌ GEMINI_API_KEY is not set in .env file');
    }
    
    if (process.env.GEMINI_API_KEY === 'your-actual-gemini-api-key-here') {
      throw new Error('❌ GEMINI_API_KEY is still set to placeholder value');
    }
    
    // IMPORTANT: Use OpenAI compatibility layer with Gemini endpoint
    this.openai = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });
    
    this.validator = new ComponentValidator();
    console.log('✅ Planner initialized with Gemini (OpenAI-compatible mode)');
  }

  async plan(userIntent, previousPlan = null) {
    console.log('🧠 Planner: Calling Gemini API...');
    console.log('📝 Intent:', userIntent);
    
    try {
      const sanitizedIntent = this.sanitizeInput(userIntent);
      
      const response = await this.openai.chat.completions.create({
        // Use Gemini 2.0 Flash - 100% FREE
        model: "gemini-2.0-flash",
        messages: [
          {
            role: 'system',
            content: PLANNER_PROMPT
              .replace('{userIntent}', sanitizedIntent)
              .replace('{previousContext}', previousPlan ? JSON.stringify(previousPlan, null, 2) : 'No previous UI - create new')
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      
      if (!content) {
        throw new Error('Empty response from Gemini');
      }

      console.log('✅ Gemini Response received');
      
      let plan;
      try {
        plan = JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse JSON:', content);
        throw new Error('Invalid JSON response from Gemini');
      }
      
      // Validate the plan
      this.validatePlan(plan);
      
      console.log('📋 Generated layout:', plan.layout);
      console.log('📋 Components:', plan.components.map(c => c.type).join(', '));
      
      return plan;
      
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      
      // Provide helpful error messages
      if (error.status === 429) {
        console.error('💰 Rate limit exceeded. Gemini free tier allows ~20 requests/day.');
        throw new Error('Gemini rate limit exceeded. Please try again tomorrow.');
      } else if (error.status === 403) {
        console.error('🔑 API key invalid or not authorized.');
        throw new Error('Invalid Gemini API key. Please check your .env file.');
      }
      
      throw new Error(`Gemini API failed: ${error.message}`);
    }
  }

  // Deterministic fallback for when API fails
  deterministicPlan(userIntent, previousPlan = null) {
    console.log('🎯 Using deterministic fallback plan');
    
    const intent = userIntent.toLowerCase();
    
    if (previousPlan) {
      return this.modifyPlan(intent, previousPlan);
    }
    
    // LOGIN FORM
    if (intent.includes('login') || intent.includes('sign in') || 
        (intent.includes('email') && intent.includes('password'))) {
      return {
        layout: 'single',
        components: [
          {
            type: 'Card',
            props: { title: 'Sign In' },
            children: [
              { type: 'Input', props: { type: 'email', label: 'Email', placeholder: 'you@example.com' } },
              { type: 'Input', props: { type: 'password', label: 'Password', placeholder: 'Enter password' } },
              { type: 'Button', props: { variant: 'primary', size: 'lg', children: 'Sign In', style: { width: '100%', marginTop: '24px' } } }
            ]
          }
        ],
        composition: 'Login form with email and password fields'
      };
    }
    
    // PRODUCT CARD
    if (intent.includes('product') && intent.includes('card')) {
      return {
        layout: 'single',
        components: [
          {
            type: 'Card',
            props: { title: 'Premium Wireless Headphones' },
            children: [
              { type: 'div', props: { style: { width: '100%', height: '200px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }, children: '🎧' } },
              { type: 'p', props: { style: { color: '#6b7280' }, children: 'High-quality wireless headphones with noise cancellation.' } },
              { type: 'div', props: { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                children: [
                  { type: 'span', props: { style: { fontSize: '24px', fontWeight: 'bold' }, children: '$299.99' } },
                  { type: 'Button', props: { variant: 'primary', size: 'md', children: 'Buy Now' } }
                ]
              }
            ]
          }
        ],
        composition: 'Product card with image, description, price and buy button'
      };
    }
    
    // DASHBOARD
    if (intent.includes('dashboard') || (intent.includes('chart') && intent.includes('table'))) {
      return {
        layout: 'split',
        components: [
          { type: 'Navbar', props: { brand: 'Analytics Dashboard', links: [{ label: 'Overview', href: '#' }, { label: 'Analytics', href: '#' }] } },
          { type: 'div', props: { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' } },
            children: [
              { type: 'Card', props: { title: 'Revenue' }, children: [{ type: 'Chart', props: { type: 'bar', data: [{ label: 'Jan', value: 4500 }, { label: 'Feb', value: 5200 }, { label: 'Mar', value: 6100 }] } }] },
              { type: 'Card', props: { title: 'Transactions' }, children: [{ type: 'Table', props: { columns: [{ key: 'date', label: 'Date' }, { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status' }], data: [{ date: '2024-01-15', amount: '$125.00', status: 'Completed' }, { date: '2024-01-14', amount: '$89.50', status: 'Pending' }] } }] }
            ]
          }
        ],
        composition: 'Dashboard with chart and table'
      };
    }
    
    // SETTINGS WITH MODAL
    if (intent.includes('settings') && intent.includes('modal')) {
      return {
        layout: 'single',
        components: [
          { type: 'Navbar', props: { brand: 'Settings', links: [{ label: 'Profile', href: '#' }, { label: 'Account', href: '#' }] } },
          { type: 'Card', props: { title: 'Account Settings' },
            children: [
              { type: 'Input', props: { type: 'text', label: 'Username', value: 'john_doe' } },
              { type: 'Input', props: { type: 'email', label: 'Email', value: 'john@example.com' } },
              { type: 'Button', props: { variant: 'primary', size: 'md', children: 'Save Changes' } },
              { type: 'Button', props: { variant: 'outline', size: 'md', children: 'Delete Account' } }
            ]
          },
          { type: 'Modal', props: { title: 'Confirm Delete', isOpen: false, onClose: 'handleCloseModal' },
            children: [
              { type: 'p', props: { children: 'Are you sure?' } },
              { type: 'Button', props: { variant: 'primary', size: 'sm', children: 'Confirm' } }
            ]
          }
        ],
        composition: 'Settings page with delete confirmation modal'
      };
    }
    
    // DEFAULT
    return {
      layout: 'single',
      components: [
        {
          type: 'Card',
          props: { title: 'Ryze AI UI Generator' },
          children: [
            { type: 'p', props: { children: 'Describe the UI you want to build.' } },
            { type: 'Button', props: { variant: 'primary', size: 'md', children: 'Get Started' } }
          ]
        }
      ],
      composition: 'Welcome card'
    };
  }

  modifyPlan(userIntent, previousPlan) {
    const modifiedPlan = JSON.parse(JSON.stringify(previousPlan));
    const intent = userIntent.toLowerCase();
    
    // Add modal if requested
    if (intent.includes('modal') || intent.includes('dialog') || intent.includes('popup')) {
      if (!modifiedPlan.components.some(c => c.type === 'Modal')) {
        modifiedPlan.components.push({
          type: 'Modal',
          props: { title: 'Confirmation', isOpen: false, onClose: 'handleCloseModal' },
          children: [
            { type: 'p', props: { children: 'Are you sure?' } },
            { type: 'Button', props: { variant: 'primary', size: 'sm', children: 'Confirm' } }
          ]
        });
      }
    }
    
    return modifiedPlan;
  }

  validatePlan(plan) {
    if (!plan) throw new Error('Plan is null');
    if (!plan.layout) throw new Error('Plan missing layout');
    if (!plan.components || !Array.isArray(plan.components)) {
      throw new Error('Plan missing components array');
    }

    const allowedComponents = [
      'Button', 'Card', 'Input', 'Table', 
      'Modal', 'Sidebar', 'Navbar', 'Chart', 'div', 'span', 'p'
    ];

    const validateComponent = (comp) => {
      if (!allowedComponents.includes(comp.type)) {
        throw new Error(`Invalid component type: ${comp.type}`);
      }
      if (comp.children) {
        if (Array.isArray(comp.children)) {
          comp.children.forEach(validateComponent);
        } else {
          validateComponent(comp.children);
        }
      }
    };

    plan.components.forEach(validateComponent);
  }

  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
      .replace(/system:/gi, '')
      .replace(/assistant:/gi, '')
      .slice(0, 1000);
  }
}