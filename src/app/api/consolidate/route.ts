import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { packageIds, shippingMethod, destinationAddress } = body

    // Validate required fields
    if (!packageIds || !Array.isArray(packageIds) || packageIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid packageIds array' },
        { status: 400 }
      )
    }

    if (!shippingMethod) {
      return NextResponse.json(
        { error: 'Missing required field: shippingMethod' },
        { status: 400 }
      )
    }

    if (!destinationAddress) {
      return NextResponse.json(
        { error: 'Missing required field: destinationAddress' },
        { status: 400 }
      )
    }

    // Validate shipping method
    const validMethods = ['air_express', 'air_economy', 'sea_lcl', 'sea_fcl']
    if (!validMethods.includes(shippingMethod)) {
      return NextResponse.json(
        { error: 'Invalid shipping method' },
        { status: 400 }
      )
    }

    // Fetch packages to validate ownership and status
    const { data: packages, error: packagesError } = await supabase
      .from('packages')
      .select('*')
      .in('id', packageIds)
      .eq('user_id', user.id)

    if (packagesError) {
      return NextResponse.json(
        { error: 'Failed to fetch packages' },
        { status: 500 }
      )
    }

    if (!packages || packages.length !== packageIds.length) {
      return NextResponse.json(
        { error: 'One or more packages not found or do not belong to user' },
        { status: 404 }
      )
    }

    // Check if all packages are in valid status for consolidation
    const invalidPackages = packages.filter(
      pkg => pkg.status !== 'received' && pkg.status !== 'stored'
    )
    
    if (invalidPackages.length > 0) {
      return NextResponse.json(
        { error: 'Some packages are not available for consolidation (must be received or stored)' },
        { status: 400 }
      )
    }

    // Calculate total weight
    const totalWeight = packages.reduce((sum, pkg) => sum + (pkg.weight_lbs || 0), 0)
    const totalValue = packages.reduce((sum, pkg) => sum + (pkg.declared_value || 0), 0)

    // Get user subscription tier for consolidation fee
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    const consolidationFees = {
      free: 5.00,
      standard: 3.00,
      premium: 0.00,
    }

    const consolidationFee = consolidationFees[userData?.subscription_tier as keyof typeof consolidationFees] || 5.00

    // Calculate shipping cost
    const { data: rate } = await supabase
      .from('shipping_rates')
      .select('*')
      .eq('method', shippingMethod)
      .lte('weight_min_lbs', totalWeight)
      .gte('weight_max_lbs', totalWeight)
      .single()

    const defaultRates = {
      air_express: { base_fee: 15, cost_per_lb: 8 },
      air_economy: { base_fee: 10, cost_per_lb: 5 },
      sea_lcl: { base_fee: 25, cost_per_lb: 2 },
      sea_fcl: { base_fee: 500, cost_per_lb: 0 },
    }

    const shippingRate = rate || {
      base_fee: defaultRates[shippingMethod as keyof typeof defaultRates]?.base_fee || 15,
      cost_per_lb: defaultRates[shippingMethod as keyof typeof defaultRates]?.cost_per_lb || 5,
    }

    const shippingCost = shippingRate.base_fee + (totalWeight * shippingRate.cost_per_lb)
    const totalCost = shippingCost + consolidationFee

    // Create shipment
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .insert({
        user_id: user.id,
        package_ids: packageIds,
        shipping_method: shippingMethod,
        destination_address: destinationAddress,
        cost_usd: totalCost,
        status: 'pending',
        customs_declaration: {
          total_value: totalValue,
          items: packages.map(pkg => ({
            tracking_number: pkg.tracking_number,
            declared_value: pkg.declared_value,
            weight_lbs: pkg.weight_lbs,
          })),
        },
      })
      .select()
      .single()

    if (shipmentError) {
      console.error('Shipment creation error:', shipmentError)
      return NextResponse.json(
        { error: 'Failed to create shipment' },
        { status: 500 }
      )
    }

    // Update packages with consolidated shipment ID
    const { error: updateError } = await supabase
      .from('packages')
      .update({ consolidated_shipment_id: shipment.id })
      .in('id', packageIds)

    if (updateError) {
      console.error('Package update error:', updateError)
    }

    // Create invoice for consolidation
    const { error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        shipment_id: shipment.id,
        type: 'consolidation',
        amount_usd: consolidationFee,
        status: 'pending',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      })

    if (invoiceError) {
      console.error('Invoice creation error:', invoiceError)
    }

    // Create invoice for shipping
    const { error: shippingInvoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        shipment_id: shipment.id,
        type: 'shipping',
        amount_usd: shippingCost,
        status: 'pending',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      })

    if (shippingInvoiceError) {
      console.error('Shipping invoice creation error:', shippingInvoiceError)
    }

    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'shipment_update',
        title: 'Consolidation Request Created',
        message: `Your consolidation request with ${packageIds.length} packages has been created. Total cost: $${totalCost.toFixed(2)}`,
        metadata: {
          shipment_id: shipment.id,
          package_count: packageIds.length,
          total_cost: totalCost,
        },
      })

    return NextResponse.json({
      success: true,
      shipment,
      cost_breakdown: {
        shipping_cost: shippingCost,
        consolidation_fee: consolidationFee,
        total_cost: totalCost,
      },
      total_weight: totalWeight,
      package_count: packageIds.length,
    })
  } catch (error: unknown) {
    console.error('Consolidation error:', error)
    return NextResponse.json(
      { error: 'Failed to process consolidation request' },
      { status: 500 }
    )
  }
}
