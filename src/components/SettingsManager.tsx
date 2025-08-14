import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { MenuItem, Order } from '../types'
import { Trash2, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react'

export function SettingsManager() {
  const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>('menuItems', [])
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', [])
  const [showConfirmMenu, setShowConfirmMenu] = useState(false)
  const [showConfirmOrders, setShowConfirmOrders] = useState(false)
  const [showConfirmAll, setShowConfirmAll] = useState(false)

  const clearMenuData = () => {
    setMenuItems([])
    setShowConfirmMenu(false)
    alert('🍽️ Menu supprimé avec succès !')
  }

  const clearOrdersData = () => {
    setOrders([])
    setShowConfirmOrders(false)
    alert('📦 Toutes les commandes supprimées !')
  }

  const clearAllData = () => {
    setMenuItems([])
    setOrders([])
    setShowConfirmAll(false)
    alert('🗑️ Toutes les données supprimées !')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          ⚙️ Paramètres
        </h2>

        {/* Statistiques */}
        <Card className="mb-6 bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg text-purple-700">
              📊 Statistiques de l'application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">🍽️ Plats dans le menu :</span>
              <span className="font-bold text-purple-600">{menuItems.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">📦 Total des commandes :</span>
              <span className="font-bold text-purple-600">{orders.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">🚚 En cours de livraison :</span>
              <span className="font-bold text-orange-600">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">✅ Livrées :</span>
              <span className="font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions de nettoyage */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-purple-700 mb-3">
            🧹 Nettoyage des données
          </h3>

          {/* Supprimer le menu */}
          <Card>
            <CardContent className="py-4">
              {!showConfirmMenu ? (
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">Supprimer le menu</h4>
                    <p className="text-sm text-gray-600">
                      Supprime tous les plats du menu ({menuItems.length} plats)
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowConfirmMenu(true)}
                    variant="destructive"
                    size="sm"
                    disabled={menuItems.length === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">Êtes-vous sûr(e) ?</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Cette action supprimera définitivement tous les plats du menu.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={clearMenuData}
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Oui, supprimer
                    </Button>
                    <Button
                      onClick={() => setShowConfirmMenu(false)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Supprimer les commandes */}
          <Card>
            <CardContent className="py-4">
              {!showConfirmOrders ? (
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">Supprimer les commandes</h4>
                    <p className="text-sm text-gray-600">
                      Supprime toutes les commandes ({orders.length} commandes)
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowConfirmOrders(true)}
                    variant="destructive"
                    size="sm"
                    disabled={orders.length === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">Êtes-vous sûr(e) ?</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Cette action supprimera définitivement toutes les commandes et livraisons.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={clearOrdersData}
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Oui, supprimer
                    </Button>
                    <Button
                      onClick={() => setShowConfirmOrders(false)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tout supprimer */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-4">
              {!showConfirmAll ? (
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-red-800">Tout supprimer</h4>
                    <p className="text-sm text-red-600">
                      Remet l'application à zéro (menu + commandes)
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowConfirmAll(true)}
                    variant="destructive"
                    size="sm"
                    disabled={menuItems.length === 0 && orders.length === 0}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset complet
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">⚠️ ATTENTION !</span>
                  </div>
                  <p className="text-sm text-red-600">
                    Cette action supprimera TOUTES les données de l'application.
                    <br />
                    Vous devrez tout recréer depuis le début.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={clearAllData}
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Oui, tout supprimer
                    </Button>
                    <Button
                      onClick={() => setShowConfirmAll(false)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Informations */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Informations</h4>
            <p className="text-sm text-blue-700">
              Les données sont stockées localement dans votre navigateur.
              <br />
              Elles ne sont pas synchronisées entre différents appareils.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
