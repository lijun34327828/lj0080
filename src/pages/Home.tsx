import { useEffect } from 'react'
import ComponentLibrary from '@/components/packages/ComponentLibrary'
import PackageCanvas from '@/components/packages/PackageCanvas'
import PackagePropertyPanel from '@/components/packages/PackagePropertyPanel'
import CalculationConsole from '@/components/calculator/CalculationConsole'
import TopBar from '@/components/layout/TopBar'
import { usePackageStore } from '@/store/usePackageStore'
import { checkHealth } from '@/services/calculationApi'

export default function Home() {
  const {
    packages,
    selectedId,
    draftRequest,
    lastResult,
    calculating,
    backendConnected,
    addPackage,
    removePackage,
    updatePackage,
    reorderPackages,
    selectPackage,
    addDiscountRule,
    removeDiscountRule,
    updateDiscountRule,
    setDraftRequest,
    calculate,
    resetToDefault,
    setBackendConnected,
  } = usePackageStore()

  useEffect(() => {
    const checkBackend = async () => {
      const healthy = await checkHealth()
      setBackendConnected(healthy)
      if (healthy) {
        calculate()
      }
    }
    checkBackend()
    const interval = setInterval(checkBackend, 5000)
    return () => clearInterval(interval)
  }, [calculate, setBackendConnected])

  const selectedPackage = packages.find(p => p.id === selectedId) || null

  return (
    <div className="h-full flex flex-col bg-ink-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="absolute inset-0 bg-grid-ink bg-[size:32px_32px] opacity-[0.08] pointer-events-none" />

      <TopBar backendConnected={backendConnected} onReset={resetToDefault} />

      <div className="flex-1 flex overflow-hidden relative z-10">
        <ComponentLibrary onAdd={addPackage} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-hidden flex">
            <div className="flex-1 min-w-0 overflow-hidden border-r border-ink-700/50">
              <PackageCanvas
                packages={packages}
                selectedId={selectedId}
                onSelect={selectPackage}
                onReorder={reorderPackages}
                onRemove={removePackage}
                onToggleEnabled={(id) => {
                  const pkg = packages.find(p => p.id === id)
                  if (pkg) {
                    updatePackage(id, { enabled: !pkg.enabled })
                  }
                }}
              />
            </div>

            <aside className="w-[380px] flex-shrink-0 bg-white/95 backdrop-blur-sm overflow-hidden">
              <PackagePropertyPanel
                pkg={selectedPackage}
                onUpdate={updatePackage}
                onAddRule={addDiscountRule}
                onRemoveRule={removeDiscountRule}
                onUpdateRule={updateDiscountRule}
              />
            </aside>
          </div>

          <div className="h-[320px] flex-shrink-0 border-t border-ink-700/50 p-4 bg-gradient-to-t from-ink-950/80 to-transparent">
            <CalculationConsole
              draftRequest={draftRequest}
              result={lastResult}
              calculating={calculating}
              onRequestChange={setDraftRequest}
            />
          </div>
        </main>
      </div>
    </div>
  )
}