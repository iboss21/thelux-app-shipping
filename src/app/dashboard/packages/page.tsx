import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function PackagesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch packages
  const { data: packages } = await supabase
    .from('packages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Packages
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage all your packages
          </p>
        </div>
      </div>

      {packages && packages.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      {pkg.photos && pkg.photos.length > 0 ? (
                        <img
                          src={pkg.photos[0]}
                          alt="Package"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {pkg.tracking_number}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {pkg.carrier || 'Unknown Carrier'}
                        </p>
                      </div>
                      
                      <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>
                          Received: {new Date(pkg.received_date).toLocaleDateString()}
                        </span>
                        {pkg.weight_lbs && (
                          <span>Weight: {pkg.weight_lbs} lbs</span>
                        )}
                      </div>
                      
                      {pkg.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {pkg.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      pkg.status === 'received' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : pkg.status === 'shipped'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : pkg.status === 'stored'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {pkg.status}
                    </span>
                    
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/packages/${pkg.id}`}>
                        View Details
                      </Link>
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
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No packages yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start shopping with your USA address to receive packages
            </p>
            <Button asChild>
              <Link href="/dashboard/address">View My Address</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
