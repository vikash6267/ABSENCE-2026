'use client';
import { useCartStore } from '@/lib/store';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/shop" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.product._id}-${item.size}`} className="flex gap-4 bg-white p-4 rounded-lg border">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.product.images?.[0] && (
                  <img 
                    src={item.product.images[0].url} 
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold mb-1">{item.product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Size: {item.size}</p>
                <p className="font-semibold">₹{item.product.price}</p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.product._id, item.size)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.size, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 border rounded hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                    className="w-8 h-8 border rounded hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{getTotal() >= 999 ? 'Free' : '₹50'}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{getTotal() >= 999 ? getTotal() : getTotal() + 50}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </button>

            <Link href="/shop" className="block text-center mt-4 text-sm text-gray-600 hover:text-black">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
