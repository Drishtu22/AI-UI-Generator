import { ComponentValidator } from '../validation/ComponentValidator.js';

export class Generator {
  constructor() {
    this.validator = new ComponentValidator();
    this.INDENT_SIZE = 2;
  }

  generate(plan) {
    try {
      // Generate component WITHOUT imports
      const componentCode = this.generateComponent(plan, 'GeneratedUI');
      return componentCode;
    } catch (error) {
      console.error('Generator error:', error);
      return this.getFallbackCode();
    }
  }

  modify(plan, existingCode) {
    try {
      // Preserve existing state and logic, only update JSX
      const jsxMatch = existingCode.match(/return\s*\(([\s\S]*)\)\s*}/);
      const existingJSX = jsxMatch ? jsxMatch[1] : null;
      
      const newJSX = this.generateJSX(plan.components, 2);
      
      if (existingJSX && this.shouldPreserveState(existingCode, plan)) {
        // Preserve state declarations, update render
        return existingCode.replace(
          /return\s*\(([\s\S]*)\)\s*}/,
          `return (\n${newJSX}\n  )}`
        );
      } else {
        // Generate fresh component
        return this.generate(plan);
      }
    } catch (error) {
      console.error('Modification error:', error);
      return this.generate(plan);
    }
  }

  generateComponent(plan, name) {
    const stateHooks = this.generateStateHooks(plan.components);
    const jsx = this.generateJSX(plan.components, 2);
    const eventHandlers = this.generateEventHandlers(plan.components);
    
    return `const ${name} = () => {
${stateHooks}
${eventHandlers}
  return (
    <div className="ui-container" style={{ padding: '1rem' }}>
      ${jsx}
    </div>
  );
};`;
  }

  generateJSX(components, indentLevel = 0) {
    const indent = ' '.repeat(indentLevel * this.INDENT_SIZE);
    
    return components.map(comp => {
      const props = this.generateProps(comp.props);
      
      if (comp.children && comp.children.length > 0) {
        return `${indent}<${comp.type}${props}>
${this.generateJSX(comp.children, indentLevel + 1)}
${indent}</${comp.type}>`;
      }
      
      // Self-closing tag for components without children
      if (['Input', 'Table', 'Chart'].includes(comp.type)) {
        return `${indent}<${comp.type}${props} />`;
      }
      
      // Default with children
      return `${indent}<${comp.type}${props}>
${indent}  ${comp.props.children || comp.type}
${indent}</${comp.type}>`;
    }).join('\n');
  }

  generateProps(props) {
    if (!props || Object.keys(props).length === 0) return '';
    
    return ' ' + Object.entries(props)
      .map(([key, value]) => {
        // Handle string props
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        }
        // Handle boolean props
        if (typeof value === 'boolean') {
          return value ? `${key}` : '';
        }
        // Handle function props
        if (typeof value === 'function') {
          return `${key}={${value.toString()}}`;
        }
        // Handle objects/arrays
        return `${key}={${JSON.stringify(value)}}`;
      })
      .filter(Boolean)
      .join(' ');
  }

  generateStateHooks(components) {
    const hooks = [];
    const componentCounts = {};
    
    const traverse = (comps) => {
      comps.forEach(comp => {
        componentCounts[comp.type] = (componentCounts[comp.type] || 0) + 1;
        if (comp.children) traverse(comp.children);
      });
    };
    
    traverse(components);
    
    // Modal state
    if (componentCounts['Modal']) {
      hooks.push('  const [isModalOpen, setIsModalOpen] = React.useState(false);');
    }
    
    // Input state
    if (componentCounts['Input']) {
      hooks.push('  const [formData, setFormData] = React.useState({});');
    }
    
    return hooks.length ? hooks.join('\n') : '  // No state required';
  }

  generateEventHandlers(components) {
    const handlers = [];
    
    const hasModal = components.some(c => c.type === 'Modal') || 
                    components.some(c => c.children?.some?.(child => child.type === 'Modal'));
    
    if (hasModal) {
      handlers.push(`  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);`);
    }
    
    return handlers.join('\n');
  }

  shouldPreserveState(existingCode, newPlan) {
    // Check if existing code has state we should preserve
    return existingCode.includes('useState') && 
           !newPlan.components.some(c => c.type === 'Modal' && !existingCode.includes('Modal'));
  }

  getFallbackCode() {
    return `const GeneratedUI = () => {
  return (
    <div style={{ padding: '1rem' }}>
      <Card title="Generated UI">
        <p>Your deterministic UI will appear here.</p>
      </Card>
    </div>
  );
};`;
  }
}