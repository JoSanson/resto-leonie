import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Gift, Sparkles, Heart } from 'lucide-react'

interface CelebrationPopupProps {
  isOpen: boolean
  onClose: () => void
  orderNumber: string
  total: number
}

export function CelebrationPopup({ isOpen, onClose, orderNumber, total }: CelebrationPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // Arrêter les confettis après 3 secondes
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    if (isOpen) {
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 celebration-overlay z-50 flex items-center justify-center p-4">
        {/* Confettis */}
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={300}
            gravity={0.3}
            colors={['#ff6b9d', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']}
          />
        )}
        
        {/* Popup */}
        <Card className="max-w-sm w-full animate-bounce-in bg-gradient-to-br from-pink-100 to-purple-100 border-4 border-purple-300 shadow-2xl">
          <CardContent className="text-center py-8 space-y-6">
            {/* Titre avec émojis animés */}
            <div className="space-y-2">
              <div className="text-6xl animate-bounce">🎉</div>
              <h2 className="text-2xl font-bold text-purple-800 flex items-center justify-center gap-2">
                <Gift className="w-6 h-6 text-pink-500 animate-pulse-slow" />
                Bravo !
                <Sparkles className="w-6 h-6 text-yellow-500 animate-sparkle" />
              </h2>
            </div>

            {/* Message principal */}
            <div className="space-y-3">
              <p className="text-lg font-semibold text-purple-700">
                Ta commande est créée ! 🛍️
              </p>
              
              <div className="bg-white/70 rounded-xl p-4 space-y-2">
                <p className="text-base font-bold text-gray-800">
                  📋 Commande #{orderNumber}
                </p>
                <p className="text-xl font-bold text-green-600 flex items-center justify-center gap-1">
                  💰 {total.toFixed(2)} €
                </p>
              </div>

              <p className="text-sm text-purple-600">
                Elle apparaît maintenant dans l'onglet
                <br />
                <strong>🚚 Livraisons</strong> !
              </p>
            </div>

            {/* Émojis décoratifs */}
            <div className="flex justify-center gap-3 text-2xl">
              <span className="animate-sparkle">🌟</span>
              <Heart className="w-6 h-6 text-red-500 animate-pulse-slow" />
              <span className="animate-sparkle">✨</span>
              <span className="animate-bounce text-yellow-500">⭐</span>
              <span className="animate-sparkle">🌟</span>
            </div>

            {/* Bouton de fermeture */}
            <Button
              onClick={onClose}
              size="lg"
              className="w-full h-12 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg"
            >
              ✨ Super ! ✨
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
