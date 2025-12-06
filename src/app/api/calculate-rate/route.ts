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
    const { weight, destination, method } = body

    // Validate required fields
    if (!weight || !destination || !method) {
      return NextResponse.json(
        { error: 'Missing required fields: weight, destination, method' },
        { status: 400 }
      )
    }

    // Validate weight is a positive number
    const weightNum = parseFloat(weight)
    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 10000) {
      return NextResponse.json(
        { error: 'Weight must be a positive number between 0 and 10000 lbs' },
        { status: 400 }
      )
    }

    // Validate shipping method
    const validMethods = ['air_express', 'air_economy', 'sea_lcl', 'sea_fcl']
    if (!validMethods.includes(method)) {
      return NextResponse.json(
        { error: 'Invalid shipping method. Must be one of: air_express, air_economy, sea_lcl, sea_fcl' },
        { status: 400 }
      )
    }

    // Validate destination is not empty
    if (typeof destination !== 'string' || destination.trim().length === 0) {
      return NextResponse.json(
        { error: 'Destination must be a non-empty string' },
        { status: 400 }
      )
    }

    // Fetch shipping rates from database
    const { data: rates } = await supabase
      .from('shipping_rates')
      .select('*')
      .eq('method', method)
      .eq('destination_country', destination)
      .lte('weight_min_lbs', weightNum)
      .gte('weight_max_lbs', weightNum)
      .single()

    // If no specific rate found, use default rates
    const defaultRates = {
      air_express: { base_fee: 15, cost_per_lb: 8 },
      air_economy: { base_fee: 10, cost_per_lb: 5 },
      sea_lcl: { base_fee: 25, cost_per_lb: 2 },
      sea_fcl: { base_fee: 500, cost_per_lb: 0 }, // FCL is custom quote
    }

    const rate = rates || {
      base_fee: defaultRates[method as keyof typeof defaultRates]?.base_fee || 15,
      cost_per_lb: defaultRates[method as keyof typeof defaultRates]?.cost_per_lb || 5,
    }

    const totalCost = rate.base_fee + (weightNum * rate.cost_per_lb)

    // Estimated delivery times
    const deliveryTimes: { [key: string]: string } = {
      air_express: '3-5 business days',
      air_economy: '7-10 business days',
      sea_lcl: '30-45 days',
      sea_fcl: '30-60 days',
    }

    return NextResponse.json({
      method,
      weight: weightNum,
      destination,
      base_fee: rate.base_fee,
      cost_per_lb: rate.cost_per_lb,
      total_cost: totalCost,
      estimated_delivery: deliveryTimes[method] || 'Contact for estimate',
      currency: 'USD',
    })
  } catch (error: unknown) {
    console.error('Rate calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate shipping rate' },
      { status: 500 }
    )
  }
}
