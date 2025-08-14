import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Order } from '../types'
import { Package, CheckCircle, Eye, Clock, Euro } from 'lucide-react'

export function DeliveryManager() {
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', [])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Filtrer les commandes en cours de livraison
  const pendingOrders = orders.filter(order => order.status === 'pending')
  const deliveredOrders = orders.filter(order => order.status === 'delivered')

  const markAsDelivered = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'delivered' as const, deliveredAt: new Date().toISOString() }
        : order
    ))
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (selectedOrder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            onClick={() => setSelectedOrder(null)}
            variant="outline"
            size="sm"
          >
            ← Retour
          </Button>
          <h2 className="text-2xl font-bold text-purple-800">
            📦 Détails de la commande
          </h2>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Commande #{selectedOrder.id.slice(-6)}
              </CardTitle>
              <Badge 
                variant={selectedOrder.status === 'delivered' ? 'default' : 'secondary'}
                className="text-sm"
              >
                {selectedOrder.status === 'delivered' ? '✅ Livrée' : '🚚 En cours'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div>
                <span className="text-sm text-gray-600">📅 Commandée le :</span>
                <p className="font-semibold">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              {selectedOrder.deliveredAt && (
                <div>
                  <span className="text-sm text-gray-600">✅ Livrée le :</span>
                  <p className="font-semibold text-green-600">{formatDate(selectedOrder.deliveredAt)}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 text-gray-800">🍽️ Articles commandés :</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{item.menuItem.name}</span>
                      <span className="text-gray-600 text-sm ml-2">
                        × {item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold">
                      {(item.menuItem.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between items-center text-lg font-bold">
              <span>💰 Total :</span>
              <span className="text-purple-700">{selectedOrder.total.toFixed(2)} €</span>
            </div>

            {selectedOrder.status === 'pending' && (
              <Button
                onClick={() => markAsDelivered(selectedOrder.id)}
                size="lg"
                className="w-full h-12 text-base bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-5 h-5" />
                Marquer comme livrée
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          🚚 Gestion des Livraisons
        </h2>

        {/* Commandes en cours */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-purple-700 mb-3">
            En cours de livraison ({pendingOrders.length})
          </h3>
          
          {pendingOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-gray-500 text-lg">
                  Aucune commande en cours de livraison.
                  <br />
                  Toutes les commandes sont livrées ! 🎉
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <Card key={order.id} className="py-3">
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-orange-500" />
                          <h4 className="font-semibold text-base">
                            Commande #{order.id.slice(-6)}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(order.createdAt)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span>
                            📦 {order.items.reduce((sum, item) => sum + item.quantity, 0)} articles
                          </span>
                          <span className="flex items-center gap-1">
                            <Euro className="w-3 h-3" />
                            {order.total.toFixed(2)} €
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full">
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4" />
                          Voir
                        </Button>
                        <Button
                          onClick={() => markAsDelivered(order.id)}
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Livrée
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Commandes livrées récentes */}
        {deliveredOrders.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-green-700 mb-3">
              ✅ Récemment livrées ({deliveredOrders.length})
            </h3>
            <div className="space-y-2">
              {deliveredOrders.slice(0, 5).map((order) => (
                <Card key={order.id} className="py-2 bg-green-50 border-green-200">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm">
                          Commande #{order.id.slice(-6)}
                        </span>
                        <span className="text-xs text-green-600 ml-2">
                          Livrée le {order.deliveredAt && formatDate(order.deliveredAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{order.total.toFixed(2)} €</span>
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
