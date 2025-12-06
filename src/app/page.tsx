import { MapPin, Package, Globe, Radar, FileText, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: MapPin,
    title: 'Your USA Address',
    description: 'Get instant USA shipping address assigned to you. Shop from any US retailer and ship to your personal suite.',
  },
  {
    icon: Package,
    title: 'Smart Consolidation',
    description: 'Combine multiple packages into one shipment. Save money on international shipping costs with our repackaging service.',
  },
  {
    icon: Globe,
    title: 'Global Shipping',
    description: 'Air & sea freight to 180+ countries. Choose from express, economy, or sea freight based on your budget and timeline.',
  },
  {
    icon: Radar,
    title: 'Live Tracking',
    description: 'Real-time updates on every shipment. Track your packages from our warehouse to your doorstep with detailed status updates.',
  },
  {
    icon: FileText,
    title: 'Custom Declarations',
    description: 'Auto-generated customs forms and commercial invoices. We handle all the paperwork for hassle-free international shipping.',
  },
  {
    icon: Shield,
    title: 'Secure Storage',
    description: 'Free 30-day climate-controlled storage. Your packages are safe in our secure warehouse until you\'re ready to ship.',
  },
]

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
    ],
  },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">TheLux Shipping</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              Pricing
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
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Shop USA,
              <br />
              <span className="text-primary">Ship Worldwide</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Get your personal USA address and forward packages to over 180 countries.
              Save money with our smart consolidation and flexible shipping options.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/signup">
                  Get Your USA Address
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/how-it-works">
                  Learn More
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Free 30-day storage • No setup fees • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Professional parcel forwarding made simple
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose the plan that fits your shipping needs
            </p>
          </div>

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
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
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

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Plus shipping costs: Air Express ($15 + $8/lb) • Air Economy ($10 + $5/lb) • Sea Freight ($25 + $2/lb)
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Shipping?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of customers who trust TheLux for their international shipping needs
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
            <Link href="/signup">
              Get Your Free USA Address
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
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
                <li><Link href="/shipping-calculator" className="hover:text-blue-400 transition-colors">Shipping Calculator</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/prohibited-items" className="hover:text-blue-400 transition-colors">Prohibited Items</Link></li>
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

