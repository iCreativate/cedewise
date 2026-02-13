'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChevronRightIcon, 
  ChevronLeftIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  DocumentChartBarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  BoltIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'

const userTypes = [
  {
    name: 'Insurers',
    description: 'Optimize your reinsurance program and find the best markets for your risks.',
    icon: ShieldCheckIcon,
    features: ['Streamlined risk submission', 'Real-time market engagement', 'Comprehensive analytics'],
    cta: 'Get Started as Insurer',
    href: '/auth/register?role=insurer',
    color: 'from-blue-500 to-blue-600',
    hoverColor: 'hover:from-blue-600 hover:to-blue-700',
  },
  {
    name: 'Brokers',
    description: 'Place risks efficiently and enhance your value proposition to clients.',
    icon: UserGroupIcon,
    features: ['End-to-end placement workflow', 'Enhanced client communication', 'Market intelligence'],
    cta: 'Get Started as Broker',
    href: '/auth/register?role=broker',
    featured: true,
    color: 'from-green-500 to-green-600',
    hoverColor: 'hover:from-green-600 hover:to-green-700',
  },
  {
    name: 'Reinsurers',
    description: 'Access quality risks and streamline underwriting decisions.',
    icon: ArrowTrendingUpIcon,
    features: ['Focused risk assessment', 'Efficient portfolio management', 'Data-driven decisions'],
    cta: 'Get Started as Reinsurer',
    href: '/auth/register?role=reinsurer',
    color: 'from-purple-500 to-purple-600',
    hoverColor: 'hover:from-purple-600 hover:to-purple-700',
  },
]

const features = [
  {
    name: 'Efficient Risk Placement',
    description: 'Submit and manage risks with an intuitive interface. Track status updates and collaborate in real-time.',
    icon: CloudArrowUpIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'Secure Communication',
    description: 'Built-in messaging and document sharing capabilities ensure smooth communication between all parties.',
    icon: LockClosedIcon,
    color: 'bg-green-500',
  },
  {
    name: 'Smart Analytics',
    description: 'Get insights into your risk portfolio with advanced analytics and reporting tools.',
    icon: DocumentChartBarIcon,
    color: 'bg-purple-500',
  },
  {
    name: 'Streamlined Workflow',
    description: "Automate routine tasks and ensure every placement follows your company's best practices.",
    icon: ArrowPathIcon,
    color: 'bg-indigo-500',
  },
  {
    name: 'Market Intelligence',
    description: 'Access real-time data on market trends, pricing, and capacity to make informed decisions.',
    icon: CurrencyDollarIcon,
    color: 'bg-rose-500',
  },
]

const testimonials = [
  {
    content: "Cedewise has transformed how we manage our reinsurance placements. The efficiency gains are remarkable.",
    author: "Sarah Johnson",
    role: "Chief Underwriting Officer",
    company: "Global Insurance Co.",
    image: "/testimonials/sarah.jpg"
  },
  {
    content: "The platform's analytics capabilities have given us unprecedented insights into our portfolio.",
    author: "Michael Chen",
    role: "Head of Reinsurance",
    company: "Pacific Re",
    image: "/testimonials/michael.jpg"
  },
  {
    content: "A game-changer for brokers. The streamlined workflow has improved our client service significantly.",
    author: "Emma Thompson",
    role: "Managing Director",
    company: "Thompson & Partners",
    image: "/testimonials/emma.jpg"
  }
]

const stats = [
  { id: 1, name: 'Active Users', value: '2,000+' },
  { id: 2, name: 'Countries', value: '50+' },
  { id: 3, name: 'Risks Placed', value: '$5B+' },
  { id: 4, name: 'Client Satisfaction', value: '98%' },
]

export default function Home() {
  const router = useRouter()
  const { login, isAuthenticated } = useUser()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (isAuthenticated) {
    router.push('/dashboard')
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      if (!email) {
        setError('Email is required')
        return
      }
      
      const success = await login(email, password || 'password123')
      
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError('An error occurred during login')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-white via-white to-gray-50">
        {/* Background gradient */}
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-green-500 to-blue-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                Now in Public Beta
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              The Future of Reinsurance
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Connect, collaborate, and close deals faster with our intelligent reinsurance platform. 
              Streamline your workflow and make data-driven decisions with powerful analytics.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/register"
                className="rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:from-green-700 hover:to-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-all duration-200"
              >
                Get Started Free
              </Link>
              <Link
                href="#features"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-green-600 transition-colors duration-200"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
            </div>
          </div>
          
      {/* Stats section */}
      <div className="relative -mt-12 sm:-mt-16 lg:-mt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-5xl rounded-3xl bg-white/80 backdrop-blur-lg shadow-xl ring-1 ring-gray-200/50 py-12 sm:py-16"
          >
            <dl className="grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
              {stats.map((stat) => (
                <div key={stat.id} className="flex flex-col items-center">
                  <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                  <dd className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl mt-2">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
                        </div>
                      </div>

      {/* Features section */}
      <div id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-green-600">Powerful Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage reinsurance
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our comprehensive platform provides all the tools you need to streamline your reinsurance operations.
            </p>
                    </div>

          <div className="mx-auto mt-16 max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.name}
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow duration-200"
                >
                  <div className={`absolute top-4 right-4 p-2 rounded-lg ${feature.color}`}>
                    <feature.icon className="h-5 w-5 text-white" aria-hidden="true" />
                          </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold leading-8 text-gray-900">{feature.name}</h3>
                    <p className="mt-2 text-base leading-7 text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* User types section */}
      <div className="py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Choose your path
            </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
              Whether you're an insurer, broker, or reinsurer, we have the tools you need to succeed.
          </p>
        </div>
        
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {userTypes.map((type) => (
              <motion.div
                key={type.name}
                whileHover={{ scale: 1.02 }}
                className={`relative flex flex-col rounded-2xl ${type.featured ? 'ring-2 ring-green-600' : 'ring-1 ring-gray-200'} bg-white shadow-lg overflow-hidden`}
              >
                {type.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Popular Choice
                    </span>
                  </div>
                )}
                <div className="p-8 sm:p-10">
                  <div className="flex items-center gap-x-4">
                    <type.icon className="h-8 w-8 text-gray-600" />
                    <h3 className="text-lg font-semibold leading-8 text-gray-900">{type.name}</h3>
                  </div>
                  <p className="mt-4 text-base leading-7 text-gray-600">{type.description}</p>
                  <ul className="mt-8 space-y-3">
                    {type.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckCircleIcon className="h-6 w-5 flex-none text-green-600" aria-hidden="true" />
                        <span className="text-sm leading-6 text-gray-600">{feature}</span>
          </li>
                    ))}
                  </ul>
                  <Link
                    href={type.href}
                    className={`mt-8 block rounded-full bg-gradient-to-r ${type.color} px-6 py-3 text-center text-sm font-semibold text-white shadow-sm ${type.hoverColor} transition-all duration-200`}
                  >
                    {type.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-green-600">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by industry leaders
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200"
                >
                  <div className="flex items-center gap-x-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                      <img src={testimonial.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                </div>
                  <blockquote className="mt-6 text-base leading-7 text-gray-600">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="mt-4 text-sm text-gray-500">{testimonial.company}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="relative isolate mt-12 sm:mt-16">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl px-6 py-24 text-center shadow-2xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to transform your reinsurance operations?
              </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-green-50">
              Join thousands of insurance professionals who are already using Cedewise to streamline their operations.
              </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/auth/register"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-green-600 shadow-sm hover:bg-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
                >
                Get started today
                </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold leading-6 text-white hover:text-green-50 transition-colors duration-200"
              >
                Contact sales <span aria-hidden="true">→</span>
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
