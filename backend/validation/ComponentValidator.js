// backend/validation/ComponentValidator.js
export class ComponentValidator {
  constructor() {
    this.allowedComponents = new Set([
      'Button', 'Card', 'Input', 'Table', 
      'Modal', 'Sidebar', 'Navbar', 'Chart'
    ]);
    
    this.componentSchemas = {
      Button: {
        variant: ['primary', 'secondary', 'outline', 'ghost'],
        size: ['sm', 'md', 'lg'],
        children: true
      },
      Card: {
        title: false,
        footer: false,
        children: true
      },
      Input: {
        type: ['text', 'email', 'password', 'number'],
        placeholder: false,
        label: false,
        value: false
      },
      Table: {
        columns: true,
        data: true
      },
      Modal: {
        title: false,
        isOpen: false,
        onClose: false,
        children: true
      },
      Sidebar: {
        items: true
      },
      Navbar: {
        brand: false,
        links: true
      },
      Chart: {
        type: ['line', 'bar', 'pie'],
        data: true,
        title: false
      }
    };
  }

  isComponentAllowed(componentType) {
    return this.allowedComponents.has(componentType);
  }

  getAllowedComponents() {
    return Array.from(this.allowedComponents);
  }

  validateProps(componentType, props) {
    const schema = this.componentSchemas[componentType];
    if (!schema) return false;
    
    // Check for undefined props that shouldn't exist
    for (const propKey in props) {
      if (!schema.hasOwnProperty(propKey)) {
        return false;
      }
    }
    
    // Validate prop values
    for (const [key, value] of Object.entries(schema)) {
      if (props[key] !== undefined) {
        if (Array.isArray(value)) {
          // Enum validation
          if (!value.includes(props[key])) {
            return false;
          }
        }
        // Additional type validation can be added here
      }
    }
    
    return true;
  }
}