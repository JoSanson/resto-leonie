import { useState } from 'react'
import { Button } from './components/ui/button'
import { MenuManager } from './components/MenuManager'
import { OrderTaker } from './components/OrderTaker'
import { DeliveryManager } from './components/DeliveryManager'
import { SettingsManager } from './components/SettingsManager'
import { ChefHat, ShoppingCart, Truck, Settings } from 'lucide-react'
import './App.css'

type Page = 'menu' | 'orders' | 'deliveries' | 'settings'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('menu')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            🍽️ Chez Léonie
          </h1>
          <p className="text-purple-600">By tonton jojo !</p>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-1 mb-6">
          <Button
            onClick={() => setCurrentPage('menu')}
            variant={currentPage === 'menu' ? 'default' : 'outline'}
            size="lg"
            className="h-12 text-sm"
          >
            <ChefHat className="w-4 h-4" />
            Menu
          </Button>
          <Button
            onClick={() => setCurrentPage('orders')}
            variant={currentPage === 'orders' ? 'default' : 'outline'}
            size="lg"
            className="h-12 text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Commandes
          </Button>
          <Button
            onClick={() => setCurrentPage('deliveries')}
            variant={currentPage === 'deliveries' ? 'default' : 'outline'}
            size="lg"
            className="h-12 text-sm"
          >
            <Truck className="w-4 h-4" />
            Livraisons
          </Button>
          <Button
            onClick={() => setCurrentPage('settings')}
            variant={currentPage === 'settings' ? 'default' : 'outline'}
            size="lg"
            className="h-12 text-sm"
          >
            <Settings className="w-4 h-4" />
            Paramètres
          </Button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          {currentPage === 'menu' && <MenuManager />}
          {currentPage === 'orders' && <OrderTaker />}
          {currentPage === 'deliveries' && <DeliveryManager />}
          {currentPage === 'settings' && <SettingsManager />}
        </div>
      </div>
    </div>
  )
}

export default App