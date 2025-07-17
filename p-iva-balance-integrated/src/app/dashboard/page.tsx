import Link from 'next/link';

// Disable prerendering for this page to avoid SSR issues with React Query
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Panoramica
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Stato generale della tua attività fiscale
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats Cards */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800">Fatture Anno Corrente</h3>
              <p className="mt-2 text-2xl font-semibold text-blue-900">
                In caricamento...
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800">Costi Anno Corrente</h3>
              <p className="mt-2 text-2xl font-semibold text-green-900">
                In caricamento...
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-800">Saldo Fiscale</h3>
              <p className="mt-2 text-2xl font-semibold text-purple-900">
                In caricamento...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Azioni Rapide
          </h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/invoices"
              className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-blue-600 font-medium">Nuova Fattura</div>
              <div className="text-sm text-blue-500 mt-1">Aggiungi una nuova fattura</div>
            </Link>

            <Link
              href="/dashboard/costs"
              className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-green-600 font-medium">Nuovo Costo</div>
              <div className="text-sm text-green-500 mt-1">Registra un nuovo costo</div>
            </Link>

            <Link
              href="/dashboard/settings"
              className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="text-purple-600 font-medium">Impostazioni</div>
              <div className="text-sm text-purple-500 mt-1">Configura parametri fiscali</div>
            </Link>

            <Link
              href="/dashboard/taxes"
              className="block p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="text-orange-600 font-medium">Calcolo Tasse</div>
              <div className="text-sm text-orange-500 mt-1">Visualizza situazione fiscale</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
