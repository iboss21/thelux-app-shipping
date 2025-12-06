'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Package, Ship, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PackageData {
  id: string
  tracking_number: string
  carrier: string
  weight_lbs: number
  received_date: string
  status: string
}

export default function ConsolidatePage() {
  const router = useRouter()
  const [packages, setPackages] = useState<PackageData[]>([])
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    shippingMethod: 'air_economy',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  })

  useEffect(() => {
    loadPackages()
  }, [])

  async function loadPackages() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('packages')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['received', 'stored'])
        .is('consolidated_shipment_id', null)
        .order('received_date', { ascending: false })
      
      setPackages(data || [])
    }
    setLoading(false)
  }

  function togglePackage(packageId: string) {
    setSelectedPackages(prev => 
      prev.includes(packageId)
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    )
  }

  function selectAll() {
    setSelectedPackages(packages.map(pkg => pkg.id))
  }

  function clearSelection() {
    setSelectedPackages([])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (selectedPackages.length === 0) {
      setError('Please select at least one package to consolidate')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/consolidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageIds: selectedPackages,
          shippingMethod: formData.shippingMethod,
          destinationAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create consolidation request')
      }

      // Redirect to shipments page
      router.push('/dashboard/shipments?consolidation=success')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedPackageData = packages.filter(pkg => selectedPackages.includes(pkg.id))
  const totalWeight = selectedPackageData.reduce((sum, pkg) => sum + (pkg.weight_lbs || 0), 0)

  const shippingMethods = [
    { value: 'air_express', label: 'Air Express (3-5 days)', rate: 8, baseFee: 15 },
    { value: 'air_economy', label: 'Air Economy (7-10 days)', rate: 5, baseFee: 10 },
    { value: 'sea_lcl', label: 'Sea LCL (30-45 days)', rate: 2, baseFee: 25 },
  ]

  const selectedMethod = shippingMethods.find(m => m.value === formData.shippingMethod)
  const estimatedCost = selectedMethod 
    ? selectedMethod.baseFee + (totalWeight * selectedMethod.rate)
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading packages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Package Consolidation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Combine multiple packages into one shipment to save on shipping costs
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Package Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select Packages</CardTitle>
                  <CardDescription>
                    Choose packages to consolidate into one shipment
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={selectAll} disabled={packages.length === 0}>
                    Select All
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearSelection} disabled={selectedPackages.length === 0}>
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {packages.length > 0 ? (
                <div className="space-y-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => togglePackage(pkg.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPackages.includes(pkg.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedPackages.includes(pkg.id)}
                          onChange={() => togglePackage(pkg.id)}
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <Package className="w-6 h-6 text-gray-400" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {pkg.tracking_number}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {pkg.carrier} • {pkg.weight_lbs} lbs • {new Date(pkg.received_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No packages available for consolidation
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Details Form */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
              <CardDescription>
                Enter your destination address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingMethod">Shipping Method</Label>
                  <select
                    id="shippingMethod"
                    value={formData.shippingMethod}
                    onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {shippingMethods.map(method => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="London"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="England"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postal Code *</Label>
                    <Input
                      id="zip"
                      type="text"
                      placeholder="SW1A 1AA"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      type="text"
                      placeholder="United Kingdom"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting || selectedPackages.length === 0}
                >
                  {submitting ? 'Creating Consolidation...' : 'Create Consolidation Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Package className="w-5 h-5" />
                  <span>Packages</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedPackages.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Ship className="w-5 h-5" />
                  <span>Total Weight</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {totalWeight.toFixed(2)} lbs
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Shipping Cost</span>
                  <span className="text-gray-900 dark:text-white">
                    ${estimatedCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Consolidation Fee</span>
                  <span className="text-gray-900 dark:text-white">
                    $3.00
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    <DollarSign className="w-5 h-5" />
                    <span>Total Estimate</span>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    ${(estimatedCost + 3).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  💡 Consolidating packages can save you up to 60% on international shipping costs!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
