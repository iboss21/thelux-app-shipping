'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { getErrorMessage } from '@/lib/errors'

export default function ReceivePackagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    trackingNumber: '',
    carrier: '',
    suiteNumber: '',
    weightLbs: '',
    length: '',
    width: '',
    height: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()

      // Find user by suite number
      const { data: addressData, error: addressError } = await supabase
        .from('usa_addresses')
        .select('user_id')
        .eq('suite_number', parseInt(formData.suiteNumber))
        .single()

      if (addressError || !addressData) {
        throw new Error('Suite number not found')
      }

      // Get the address ID
      const { data: address } = await supabase
        .from('usa_addresses')
        .select('id')
        .eq('suite_number', parseInt(formData.suiteNumber))
        .single()

      // Create package
      const { data: packageData, error: packageError } = await supabase
        .from('packages')
        .insert({
          user_id: addressData.user_id,
          usa_address_id: address?.id,
          tracking_number: formData.trackingNumber,
          carrier: formData.carrier,
          weight_lbs: parseFloat(formData.weightLbs) || null,
          dimensions: {
            length: parseFloat(formData.length) || null,
            width: parseFloat(formData.width) || null,
            height: parseFloat(formData.height) || null,
          },
          notes: formData.notes,
          status: 'received',
        })
        .select()
        .single()

      if (packageError) throw packageError

      // Create notification for user
      await supabase
        .from('notifications')
        .insert({
          user_id: addressData.user_id,
          type: 'package_received',
          title: 'Package Received',
          message: `Your package with tracking number ${formData.trackingNumber} has been received at our warehouse.`,
          metadata: {
            package_id: packageData.id,
            tracking_number: formData.trackingNumber,
          },
        })

      // Send email notification
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packageId: packageData.id }),
        })
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
        // Don't fail the entire operation if email fails
      }

      setSuccess(true)
      setFormData({
        trackingNumber: '',
        carrier: '',
        suiteNumber: '',
        weightLbs: '',
        length: '',
        width: '',
        height: '',
        notes: '',
      })

      // Redirect to packages queue after 2 seconds
      setTimeout(() => {
        router.push('/admin/packages')
      }, 2000)
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Receive Package
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Log a new package that arrived at the warehouse
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package Information</CardTitle>
          <CardDescription>
            Enter the details of the received package
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-md text-sm">
                Package received successfully! Redirecting to packages queue...
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="suiteNumber">Suite Number *</Label>
                <Input
                  id="suiteNumber"
                  type="number"
                  placeholder="1234"
                  value={formData.suiteNumber}
                  onChange={(e) => setFormData({ ...formData, suiteNumber: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  The suite number from the shipping label
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trackingNumber">Tracking Number *</Label>
                <Input
                  id="trackingNumber"
                  type="text"
                  placeholder="1Z999AA10123456784"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carrier">Carrier</Label>
                <Input
                  id="carrier"
                  type="text"
                  placeholder="USPS, FedEx, UPS, DHL"
                  value={formData.carrier}
                  onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightLbs">Weight (lbs)</Label>
                <Input
                  id="weightLbs"
                  type="number"
                  step="0.01"
                  placeholder="2.5"
                  value={formData.weightLbs}
                  onChange={(e) => setFormData({ ...formData, weightLbs: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dimensions (inches)</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length" className="text-xs text-muted-foreground">
                    Length
                  </Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    placeholder="12"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width" className="text-xs text-muted-foreground">
                    Width
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    placeholder="8"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-xs text-muted-foreground">
                    Height
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    placeholder="4"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <textarea
                id="notes"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Any additional notes about the package condition, contents, etc."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Photos</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Photo upload feature coming soon
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Upload 2-4 photos of the package (all sides)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Receiving Package...' : 'Receive Package'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/packages')}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
