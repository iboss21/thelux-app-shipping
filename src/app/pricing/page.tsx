import { Package, Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out our service',
    features: [
      '1 package per month',
      'USA shipping address',
      'No free storage',
      'Email support',
      'Standard shipping rates',
      'Basic tracking',
    ],
  },
  {
    name: 'Standard',
    price: '$15',
    description: 'Great for regular shoppers',
    features: [
      '5 packages per month',
      'USA shipping address',
      '30 days free storage',
      'Email support',
      'Standard shipping rates',
      'Real-time tracking',
      'Package consolidation',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: '$40',
    description: 'Best for power users',
    features: [
      'Unlimited packages',
      'USA shipping address',
      '60 days free storage',
      'Priority support',
      '10% shipping discount',
      'Real-time tracking',
      'Package consolidation',
      'Free repackaging',
    ],
  },
]

const shippingRates = [
  {
    method: 'Air Express',
    time: '3-5 business days',
    baseFee: '$15',
    perLb: '$8/lb',
    description: 'Fastest delivery via DHL/FedEx Express',
  },
  {
    method: 'Air Economy',
    time: '7-10 business days',
    baseFee: '$10',
    perLb: '$5/lb',
    description: 'Balance of speed and cost',
  },
  {
    method: 'Sea LCL',
    time: '30-45 days',
    baseFee: '$25',
    perLb: '$2/lb',
    description: 'Most economical for heavier shipments',
  },
  {
    method: 'Sea FCL',
    time: '30-60 days',
    baseFee: 'Custom',
    perLb: 'Quote',
    description: 'Full container for large volume shipments',
  },
]

const additionalFees = [
  { service: 'Package Consolidation', fee: '$10 + $0.50 per additional package' },
  { service: 'Repackaging', fee: '$5 per package (Free for Premium)' },
  { service: 'Storage (after free period)', fee: '$2 per package per week' },
  { service: 'Package Disposal', fee: 'Free' },
  { service: 'Customs Broker Assistance', fee: '$50 for shipments over $800' },
  { service: 'Return Shipping to USA Seller', fee: 'Actual cost + $10 handling' },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Package className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">TheLux Shipping</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              Login
            </Link>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose the plan that fits your shipping needs. No hidden fees.
          </p>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Subscription Plans
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 ${
                  tier.popular
                    ? 'border-blue-500 shadow-2xl scale-105'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {tier.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={tier.popular ? 'default' : 'outline'}
                  size="lg"
                  asChild
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Rates */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Shipping Rates
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {shippingRates.map((rate, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{rate.method}</CardTitle>
                  <CardDescription>{rate.time}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Base Fee:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{rate.baseFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Per Pound:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{rate.perLb}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                      {rate.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Fees */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Additional Services
          </h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {additionalFees.map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <span className="text-gray-900 dark:text-white font-medium">{item.service}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-right">{item.fee}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Saving on Shipping?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of customers shipping smarter with TheLux
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
            <Link href="/signup">
              Create Free Account
            </Link>
          </Button>
          <p className="mt-4 text-sm text-blue-100">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold text-white">TheLux Shipping</span>
              </div>
              <p className="text-sm text-gray-400">
                International parcel forwarding made simple and affordable.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 TheLux Shipping. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
