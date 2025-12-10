import { createClient } from '@/lib/supabase/server'
import { sendPackageReceivedEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication and admin role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { packageId } = body

    if (!packageId) {
      return NextResponse.json(
        { error: 'Missing required field: packageId' },
        { status: 400 }
      )
    }

    // Fetch package details
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('*, users(email, name)')
      .eq('id', packageId)
      .single()

    if (packageError || !packageData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Send email notification
    const packageUser = packageData.users as unknown as { email: string; name: string }
    
    if (packageUser?.email) {
      await sendPackageReceivedEmail(packageUser.email, {
        userName: packageUser.name,
        trackingNumber: packageData.tracking_number,
        carrier: packageData.carrier || 'Unknown',
        receivedDate: new Date(packageData.received_date).toLocaleDateString(),
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Notification sent',
    })
  } catch (error: unknown) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
