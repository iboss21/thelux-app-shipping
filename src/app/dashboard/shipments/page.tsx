import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Ship } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ShipmentsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch shipments
  const { data: shipments } = await supabase
    .from('shipments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Shipments
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track all your international shipments
        </p>
      </div>

      {shipments && shipments.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {shipments.map((shipment) => (
            <Card key={shipment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Ship className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {shipment.tracking_number || 'Tracking pending'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {shipment.shipping_method.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Destination:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {typeof shipment.destination_address === 'object' && shipment.destination_address !== null
                            ? `${(shipment.destination_address as { city?: string; country?: string }).city}, ${(shipment.destination_address as { city?: string; country?: string }).country}`
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          ${shipment.cost_usd}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Created:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(shipment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {shipment.estimated_delivery && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Est. Delivery:</span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(shipment.estimated_delivery).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status Timeline */}
                    <div className="flex items-center gap-2 mt-4">
                      <div className={`w-3 h-3 rounded-full ${
                        ['pending', 'in_transit', 'customs', 'delivered'].includes(shipment.status)
                          ? 'bg-blue-500'
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`} />
                      <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700">
                        <div 
                          className="h-full bg-blue-500 transition-all"
                          style={{
                            width: shipment.status === 'pending' ? '25%' 
                              : shipment.status === 'in_transit' ? '50%'
                              : shipment.status === 'customs' ? '75%'
                              : shipment.status === 'delivered' ? '100%'
                              : '0%'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      shipment.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : shipment.status === 'in_transit'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : shipment.status === 'customs'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                        : shipment.status === 'delivered'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {shipment.status.replace('_', ' ')}
                    </span>
                    
                    <Button size="sm" variant="outline">
                      Track
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No shipments yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven&apos;t created any shipments. Start by selecting packages to ship.
            </p>
            <Button asChild>
              <Link href="/dashboard/packages">View Packages</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
