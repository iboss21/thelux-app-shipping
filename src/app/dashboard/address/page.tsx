import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MapPin, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function AddressPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch user data with USA address
  const { data: userData } = await supabase
    .from('users')
    .select(`
      *,
      usa_addresses (*)
    `)
    .eq('id', user.id)
    .single()

  const usaAddress = userData?.usa_addresses

  if (!usaAddress) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My USA Address
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your personal USA shipping address
          </p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No USA address assigned yet. Please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formattedAddress = `${userData.name} - Suite ${usaAddress.suite_number}
${usaAddress.street}
${usaAddress.city}, ${usaAddress.state} ${usaAddress.zip}
United States`

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My USA Address
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Use this address when shopping online in the USA
        </p>
      </div>

      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Your Personal USA Address
          </CardTitle>
          <CardDescription>
            Ship all your US purchases to this address. Make sure to include your suite number.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 font-mono text-lg">
            <div className="space-y-1">
              <div className="font-bold text-gray-900 dark:text-white">
                {userData.name} - Suite {usaAddress.suite_number}
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                {usaAddress.street}
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                {usaAddress.city}, {usaAddress.state} {usaAddress.zip}
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                United States
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => {
                navigator.clipboard.writeText(formattedAddress)
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Address
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span>
                <strong>Always include your suite number</strong> - Suite {usaAddress.suite_number} is unique to you
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span>
                <strong>Use your full name</strong> - Must match your account name: {userData.name}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span>
                <strong>Free storage</strong> - First 30 days free for Standard plan, 60 days for Premium
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span>
                <strong>Email notifications</strong> - We'll email you when packages arrive
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span>
                <strong>Prohibited items</strong> - Check our prohibited items list before ordering
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
