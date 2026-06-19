const NAV = [
  { id: 'dashboard',  label: 'Dashboard',          icon: '📊' },
  { id: 'products',   label: 'Products',            icon: '📦' },
  { id: 'generator',  label: 'Listing Generator',   icon: '✍️'  },
  { id: 'calendar',   label: 'Content Calendar',    icon: '📅' },
]

export default function Layout({ children, activeTab, setActiveTab, productCount }) {
  return (
    <div className="flex h-screen overflow-hidden bg-tmc-cream">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-tmc-navy text-white flex-shrink-0">
        <div className="px-6 pt-7 pb-6 border-b border-white/10">
          <div className="text-2xl mb-1">🐾</div>
          <h1 className="text-base font-bold leading-tight text-white">Traveling Maine Coons</h1>
          <p className="text-xs text-white/50 mt-0.5">Etsy POD Hub</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${activeTab === item.id
                  ? 'bg-tmc-teal text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-5 py-5 border-t border-white/10">
          <div className="text-xs text-white/40 leading-relaxed">
            <div className="font-medium text-white/60 mb-1">POD Platform</div>
            <div>Printify → Etsy</div>
            <div className="mt-2 font-medium text-white/60 mb-1">Shop Name</div>
            <div>Traveling Maine Coons</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between bg-tmc-navy text-white px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-bold text-sm">TMC Etsy Hub</span>
          </div>
          <span className="text-white/50 text-sm">{productCount} products</span>
        </header>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-tmc-navy flex z-50 border-t border-white/10">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors
                ${activeTab === item.id ? 'text-tmc-amber' : 'text-white/50'}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="hidden xs:block">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
