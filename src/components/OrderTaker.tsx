import { useState, useMemo } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { CelebrationPopup } from './CelebrationPopup'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { MenuItem, OrderItem, Order } from '../types'
import { Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react'

export function OrderTaker() {
  const [menuItems] = useLocalStorage<MenuItem[]>('menuItems', [])
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', [])
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [lastOrder, setLastOrder] = useState<Order | null>(null)

  const orderTotal = useMemo(() => {
    return currentOrder.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0)
  }, [currentOrder])

  const addToOrder = (menuItem: MenuItem) => {
    const existingItem = currentOrder.find(item => item.menuItem.id === menuItem.id)
    
    if (existingItem) {
      setCurrentOrder(currentOrder.map(item =>
        item.menuItem.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      const newOrderItem: OrderItem = {
        id: `${menuItem.id}-${Date.now()}`,
        menuItem,
        quantity: 1
      }
      setCurrentOrder([...currentOrder, newOrderItem])
    }
  }

  const updateQuantity = (orderItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCurrentOrder(currentOrder.filter(item => item.id !== orderItemId))
    } else {
      setCurrentOrder(currentOrder.map(item =>
        item.id === orderItemId
          ? { ...item, quantity: newQuantity }
          : item
      ))
    }
  }

  const clearOrder = () => {
    setCurrentOrder([])
  }

  const completeOrder = () => {
    if (currentOrder.length > 0) {
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        items: currentOrder,
        total: orderTotal,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      
      setOrders([newOrder, ...orders])
      setLastOrder(newOrder)
      setShowCelebration(true)
      setCurrentOrder([])
    }
  }

  const closeCelebration = () => {
    setShowCelebration(false)
    setLastOrder(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          🛒 Prendre une Commande
        </h2>

        {/* Menu items to order from */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-purple-700 mb-3">
            Menu disponible
          </h3>
          
          {menuItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-gray-500">
                  Aucun plat disponible.
                  <br />
                  Va dans l'onglet Menu pour ajouter des plats ! 🍽️
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {menuItems.map((item) => (
                <Card key={item.id} className="py-3">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-gray-800">
                          {item.name}
                        </h4>
                        <Badge variant="outline" className="mt-1">
                          {item.price.toFixed(2)} €
                        </Badge>
                      </div>
                      <Button
                        onClick={() => addToOrder(item)}
                        size="sm"
                        className="ml-3"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Current order */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-purple-700">
              Commande en cours
            </h3>
            {currentOrder.length > 0 && (
              <Button
                onClick={clearOrder}
                variant="outline"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
                Vider
              </Button>
            )}
          </div>

          {currentOrder.length === 0 ? (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-gray-500">
                  Commande vide.
                  <br />
                  Ajoute des plats depuis le menu ! 🛍️
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {currentOrder.map((orderItem) => (
                  <Card key={orderItem.id} className="py-3">
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-base text-gray-800">
                            {orderItem.menuItem.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {orderItem.menuItem.price.toFixed(2)} € × {orderItem.quantity} = {' '}
                            <span className="font-semibold">
                              {(orderItem.menuItem.price * orderItem.quantity).toFixed(2)} €
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => updateQuantity(orderItem.id, orderItem.quantity - 1)}
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold">
                            {orderItem.quantity}
                          </span>
                          <Button
                            onClick={() => updateQuantity(orderItem.id, orderItem.quantity + 1)}
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order total and complete button */}
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-purple-800">
                      Total: {orderTotal.toFixed(2)} €
                    </span>
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {currentOrder.reduce((sum, item) => sum + item.quantity, 0)} articles
                    </Badge>
                  </div>
                  <Button
                    onClick={completeOrder}
                    size="lg"
                    className="w-full h-12 text-base bg-green-600 hover:bg-green-700"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Finaliser la commande
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Popup de célébration */}
      {lastOrder && (
        <CelebrationPopup
          isOpen={showCelebration}
          onClose={closeCelebration}
          orderNumber={lastOrder.id.slice(-6)}
          total={lastOrder.total}
        />
      )}
    </div>
  )
}
