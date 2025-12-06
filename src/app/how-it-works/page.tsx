import { Package, UserPlus, ShoppingCart, Inbox, Ship, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const steps = [
  {
    number: '1',
    icon: UserPlus,
    title: 'Sign Up & Get Your USA Address',
    description: 'Create your free account and instantly receive your personal USA shipping address with a unique suite number. Use this address for all your US online shopping.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    number: '2',
    icon: ShoppingCart,
    title: 'Shop from US Stores',
    description: 'Shop at any US online retailer and use your TheLux USA address at checkout. Make sure to include your suite number in the address.',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    number: '3',
    icon: Inbox,
    title: 'We Receive Your Packages',
    description: 'Your packages arrive at our secure warehouse in New York. We inspect, photograph, weigh, and measure each package. You\'ll receive an email notification.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
  },
  {
    number: '4',
    icon: Ship,
    title: 'Choose Shipping Method',
    description: 'Select your preferred shipping method - Air Express (3-5 days), Air Economy (7-10 days), or Sea Freight (30-45 days). You can also consolidate multiple packages to save money.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
  },
  {
    number: '5',
    icon: CheckCircle,
    title: 'Receive at Your Doorstep',
    description: 'We handle all customs paperwork and ship your package internationally. Track your shipment in real-time and receive it at your doorstep.',
    color: 'text-teal-600',
    bgColor: 'bg-teal-100 dark:bg-teal-900/20',
  },
]

const features = [
  {
    question: 'What can I ship?',
    answer: 'Most items can be shipped internationally. We handle electronics, clothing, accessories, books, and more. Check our prohibited items list for restrictions.',
  },
  {
    question: 'How long can I store packages?',
    answer: 'Free plans get no free storage. Standard plans get 30 days free storage. Premium plans get 60 days. After that, it\'s $2/package/week.',
  },
  {
    question: 'Can I combine packages?',
    answer: 'Yes! Our consolidation service lets you combine multiple packages into one shipment to save on international shipping costs. Fee: $10 + $0.50 per additional package.',
  },
  {
    question: 'What about customs?',
    answer: 'We handle all customs paperwork for you. We auto-generate commercial invoices and customs forms. For shipments over $800, we provide customs broker assistance.',
  },
]

export default function HowItWorksPage() {
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
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How TheLux Shipping Works
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Ship from the USA to anywhere in the world in 5 simple steps
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center`}>
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-bold text-primary">{step.number}</span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Sign up now and get your USA address in seconds
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
            <Link href="/signup">
              Create Free Account
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
