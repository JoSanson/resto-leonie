import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { MenuItem } from '../types'
import { Plus, Trash2, Edit } from 'lucide-react'

export function MenuManager() {
  const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>('menuItems', [])
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState('')

  const addMenuItem = () => {
    if (newItemName.trim() && newItemPrice.trim()) {
      const price = parseFloat(newItemPrice)
      if (price > 0) {
        const newItem: MenuItem = {
          id: Date.now().toString(),
          name: newItemName.trim(),
          price: price
        }
        setMenuItems([...menuItems, newItem])
        setNewItemName('')
        setNewItemPrice('')
      }
    }
  }

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id))
  }

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id)
    setEditName(item.name)
    setEditPrice(item.price.toString())
  }

  const saveEdit = () => {
    if (editName.trim() && editPrice.trim()) {
      const price = parseFloat(editPrice)
      if (price > 0) {
        setMenuItems(menuItems.map(item => 
          item.id === editingId 
            ? { ...item, name: editName.trim(), price: price }
            : item
        ))
        cancelEdit()
      }
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditPrice('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          🍳 Gérer le Menu
        </h2>
        
        {/* Add new item form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-purple-700">
              Ajouter un nouveau plat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Nom du plat
              </label>
              <Input
                type="text"
                placeholder="Ex: Pizza Margherita"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="text-base h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Prix (€)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 12.50"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="text-base h-12"
              />
            </div>
            <Button 
              onClick={addMenuItem}
              size="lg"
              className="w-full h-12 text-base"
              disabled={!newItemName.trim() || !newItemPrice.trim()}
            >
              <Plus className="w-5 h-5" />
              Ajouter au menu
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Menu items list */}
      <div>
        <h3 className="text-xl font-semibold text-purple-700 mb-4">
          Menu actuel ({menuItems.length} plats)
        </h3>
        
        {menuItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 text-lg">
                Aucun plat dans le menu pour le moment.
                <br />
                Ajoute ton premier plat ! 🍽️
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {menuItems.map((item) => (
              <Card key={item.id} className="py-4">
                <CardContent>
                  {editingId === item.id ? (
                    <div className="space-y-3">
                      <Input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-base h-10"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="text-base h-10"
                      />
                      <div className="flex gap-2">
                        <Button onClick={saveEdit} size="sm" className="flex-1">
                          Sauvegarder
                        </Button>
                        <Button onClick={cancelEdit} variant="outline" size="sm" className="flex-1">
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-800">
                          {item.name}
                        </h4>
                        <Badge variant="secondary" className="mt-1">
                          {item.price.toFixed(2)} €
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEdit(item)}
                          variant="outline"
                          size="icon"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => deleteMenuItem(item.id)}
                          variant="destructive"
                          size="icon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
