import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Package, Ship, DollarSign, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch user data
  const { data: userData } = await supabase
    .from('users')
    .select('*, usa_addresses(*)')
    .eq('id', user.id)
    .single()

  // Fetch packages
  const { data: packages } = await supabase
    .from('packages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch shipments
  const { data: shipments } = await supabase
    .from('shipments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch pending invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'pending')

  const stats = [
    {
      name: 'Pending Packages',
      value: packages?.filter(p => p.status === 'received').length || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      name: 'Active Shipments',
      value: shipments?.filter(s => s.status === 'in_transit').length || 0,
      icon: Ship,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      name: 'Pending Invoices',
      value: invoices?.length || 0,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      name: 'Storage Days Used',
      value: '0',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {userData?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here&apos;s an overview of your shipping activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Packages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Packages</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/packages">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {packages && packages.length > 0 ? (
            <div className="space-y-4">
              {packages.slice(0, 5).map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {pkg.tracking_number}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Received: {new Date(pkg.received_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      pkg.status === 'received' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : pkg.status === 'shipped'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {pkg.status}
                    </span>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/dashboard/packages/${pkg.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No packages yet. Start shopping with your USA address!
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/address">View My Address</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Shipments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Shipments</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/shipments">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {shipments && shipments.length > 0 ? (
            <div className="space-y-4">
              {shipments.slice(0, 5).map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {shipment.tracking_number || 'Pending'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {shipment.shipping_method.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      shipment.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : shipment.status === 'in_transit'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : shipment.status === 'delivered'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {shipment.status}
                    </span>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/dashboard/shipments/${shipment.id}`}>
                        Track
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Ship className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No active shipments
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
