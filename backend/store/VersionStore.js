import { v4 as uuidv4 } from 'uuid';

class VersionStoreClass {
  constructor() {
    this.versions = new Map();
    this.initialized = false;
  }

  initialize() {
    if (!this.initialized) {
      this.initializeDemoVersion();
      this.initialized = true;
      console.log('📦 VersionStore initialized with demo version');
    }
  }

  createVersion({ intent, plan, code, explanation, parentId = null }) {
    const version = {
      id: uuidv4(),
      intent,
      plan,
      code,
      explanation,
      parentId,
      timestamp: Date.now(),
      metadata: {
        componentCount: plan.components?.length || 0,
        layout: plan.layout || 'single',
        hasModal: plan.components?.some(c => c.type === 'Modal') || false
      }
    };
    
    this.versions.set(version.id, version);
    console.log(`✅ Created version ${version.id} (parent: ${parentId || 'none'})`);
    console.log(`📊 Total versions: ${this.versions.size}`);
    return version;
  }

  getVersion(id) {
    if (!id) return null;
    const version = this.versions.get(id);
    if (version) {
      console.log(`📖 Found version ${id}`);
    } else {
      console.log(`❌ Version ${id} not found. Available versions: ${Array.from(this.versions.keys()).join(', ')}`);
    }
    return version;
  }

  getAllVersions() {
    const versions = Array.from(this.versions.values())
      .sort((a, b) => b.timestamp - a.timestamp);
    console.log(`📚 Retrieved ${versions.length} versions`);
    return versions;
  }

  getVersionHistory(versionId) {
    const history = [];
    let current = this.versions.get(versionId);
    
    while (current) {
      history.unshift(current);
      current = current.parentId ? this.versions.get(current.parentId) : null;
    }
    
    return history;
  }

  clear() {
    this.versions.clear();
    this.initialized = false;
    this.initialize();
    console.log('🧹 Version store cleared and reinitialized');
  }

  initializeDemoVersion() {
    const demoIntent = "Show me a dashboard with a chart and table";
    const demoPlan = {
      layout: "split",
      components: [
        {
          type: "Navbar",
          props: {
            brand: "Analytics Dashboard",
            links: [
              { label: "Overview", href: "#" },
              { label: "Analytics", href: "#" }
            ]
          }
        },
        {
          type: "Card",
          props: {
            title: "Revenue Overview"
          },
          children: [
            {
              type: "Chart",
              props: {
                type: "bar",
                title: "Monthly Revenue",
                data: [
                  { label: "Jan", value: 4500 },
                  { label: "Feb", value: 5200 },
                  { label: "Mar", value: 6100 }
                ]
              }
            }
          ]
        },
        {
          type: "Card",
          props: {
            title: "Recent Transactions"
          },
          children: [
            {
              type: "Table",
              props: {
                columns: [
                  { key: "date", label: "Date" },
                  { key: "amount", label: "Amount" },
                  { key: "status", label: "Status" }
                ],
                data: [
                  { date: "2024-01-15", amount: "$125.00", status: "Completed" },
                  { date: "2024-01-14", amount: "$89.50", status: "Pending" }
                ]
              }
            }
          ]
        }
      ],
      composition: "Dashboard with navigation, revenue chart, and transactions table"
    };

    const demoCode = `const GeneratedUI = () => {
  // No state required

  return (
    <div style={{ padding: '1rem' }}>
      <Navbar brand="Analytics Dashboard" links={[{"label":"Overview","href":"#"},{"label":"Analytics","href":"#"}]} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <Card title="Revenue Overview">
          <Chart type="bar" title="Monthly Revenue" data={[{"label":"Jan","value":4500},{"label":"Feb","value":5200},{"label":"Mar","value":6100}]} />
        </Card>
        <Card title="Recent Transactions">
          <Table columns={[{"key":"date","label":"Date"},{"key":"amount","label":"Amount"},{"key":"status","label":"Status"}]} data={[{"date":"2024-01-15","amount":"$125.00","status":"Completed"},{"date":"2024-01-14","amount":"$89.50","status":"Pending"}]} />
        </Card>
      </div>
    </div>
  );
};`;

    const demoExplanation = `I created an analytics dashboard based on your request. 

Layout: I used a split layout with a navigation bar at the top and two equal-width cards below. This allows you to see revenue data and recent transactions side-by-side for easy comparison.

Components: 
• Navbar provides consistent branding and navigation
• Card components frame each data section with clear visual separation
• Chart visualizes monthly revenue trends with an intuitive bar chart
• Table displays transaction data in structured, sortable columns

Trade-off: I balanced comprehensive data display with visual clarity. The dashboard shows key metrics at a glance without overwhelming you with too many elements.`;

    this.createVersion({
      intent: demoIntent,
      plan: demoPlan,
      code: demoCode,
      explanation: demoExplanation
    });
  }
}

// Create singleton instance
const VersionStore = new VersionStoreClass();
VersionStore.initialize();

export { VersionStore };