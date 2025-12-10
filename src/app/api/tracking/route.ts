import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendShipmentUpdateEmail, sendDeliveryEmail } from '@/lib/email'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// This endpoint receives tracking updates from shipping carriers or tracking services
export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin()

  try {
    const body = await request.json()
    const { trackingNumber, status, carrier, location, timestamp, estimatedDelivery } = body

    // Validate required fields
    if (!trackingNumber || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: trackingNumber, status' },
        { status: 400 }
      )
    }

    // Find shipment by tracking number
    const { data: shipment, error: shipmentError } = await supabaseAdmin
      .from('shipments')
      .select('*, users(email, name)')
      .eq('tracking_number', trackingNumber)
      .single()

    if (shipmentError || !shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    // Map external status to our internal status
    const statusMap: { [key: string]: string } = {
      'in_transit': 'in_transit',
      'out_for_delivery': 'in_transit',
      'delivered': 'delivered',
      'customs': 'customs',
      'exception': 'in_transit',
      'returned': 'cancelled',
    }

    const mappedStatus = statusMap[status.toLowerCase()] || 'in_transit'

    // Update shipment status
    const updateData: { 
      status: string
      carrier?: string
      estimated_delivery?: string
      actual_delivery?: string
      updated_at?: string
    } = {
      status: mappedStatus,
      updated_at: new Date().toISOString(),
    }

    if (carrier) {
      updateData.carrier = carrier
    }

    if (estimatedDelivery) {
      updateData.estimated_delivery = estimatedDelivery
    }

    if (mappedStatus === 'delivered') {
      updateData.actual_delivery = timestamp || new Date().toISOString()
    }

    const { error: updateError } = await supabaseAdmin
      .from('shipments')
      .update(updateData)
      .eq('id', shipment.id)

    if (updateError) {
      console.error('Failed to update shipment:', updateError)
      return NextResponse.json(
        { error: 'Failed to update shipment' },
        { status: 500 }
      )
    }

    // Create notification
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: shipment.user_id,
        type: mappedStatus === 'delivered' ? 'delivery' : 'shipment_update',
        title: `Tracking Update: ${status}`,
        message: `Your shipment ${trackingNumber} status: ${status}${location ? ` at ${location}` : ''}`,
        metadata: {
          shipment_id: shipment.id,
          tracking_number: trackingNumber,
          status,
          location,
          timestamp,
        },
      })

    // Send email notification
    const userData = shipment.users as unknown as { email: string; name: string }
    
    if (userData?.email) {
      if (mappedStatus === 'delivered') {
        await sendDeliveryEmail(userData.email, {
          userName: userData.name,
          trackingNumber,
          deliveryDate: new Date(timestamp || Date.now()).toLocaleDateString(),
        })
      } else {
        await sendShipmentUpdateEmail(userData.email, {
          userName: userData.name,
          trackingNumber,
          status,
          estimatedDelivery: estimatedDelivery 
            ? new Date(estimatedDelivery).toLocaleDateString()
            : undefined,
        })
      }
    }

    return NextResponse.json({
      success: true,
      shipment_id: shipment.id,
      status: mappedStatus,
    })
  } catch (error: unknown) {
    console.error('Tracking webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process tracking update' },
      { status: 500 }
    )
  }
}

// GET endpoint to manually fetch tracking info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trackingNumber = searchParams.get('tracking')

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Missing tracking parameter' },
        { status: 400 }
      )
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find shipment
    const { data: shipment, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('tracking_number', trackingNumber)
      .eq('user_id', user.id)
      .single()

    if (error || !shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      tracking_number: shipment.tracking_number,
      status: shipment.status,
      carrier: shipment.carrier,
      estimated_delivery: shipment.estimated_delivery,
      actual_delivery: shipment.actual_delivery,
      updated_at: shipment.updated_at,
    })
  } catch (error: unknown) {
    console.error('Tracking fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    )
  }
}
