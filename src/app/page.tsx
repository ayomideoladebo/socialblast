import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCheck, FiSmartphone, FiGift, FiGlobe, FiMessageCircle, FiShield } from "react-icons/fi";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 sm:pt-24">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">SocialBlast</span>
                <span className="block text-indigo-600 dark:text-indigo-400">Your Digital Services Hub</span>
              </h1>
              <p className="mt-6 text-xl text-gray-500 dark:text-gray-300">
                One platform for all your digital needs. Get temporary phone numbers, eSIMs, gift cards, and social media marketing services in one place.
              </p>
              <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:justify-start lg:justify-start">
                <Link
                  href="/dashboard"
                  className="rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-1"
                >
                  Get Started
                </Link>
                <Link
                  href="/blog"
                  className="rounded-md bg-white px-8 py-3 text-base font-medium text-indigo-600 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700 transition-all duration-200 transform hover:-translate-y-1"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full overflow-hidden rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800">
                  <img
                    className="w-full"
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80"
                    alt="App screenshot"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 dark:bg-gray-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              All-in-One Digital Services
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300">
              Everything you need in one convenient platform
            </p>
          </div>

          <div className="mt-16">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-xl bg-gray-50 p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <FiSmartphone className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Temporary Phone Numbers</h3>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Get instant access to temporary phone numbers for verification, privacy, and more.
                </p>
                <Link
                  href="/dashboard/phone-numbers"
                  className="mt-6 inline-flex items-center text-indigo-600 dark:text-indigo-400"
                >
                  Learn more <FiArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl bg-gray-50 p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <FiGlobe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">eSIM Services</h3>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Stay connected worldwide with our affordable eSIM options for travelers and digital nomads.
                </p>
                <Link
                  href="/dashboard/esim"
                  className="mt-6 inline-flex items-center text-indigo-600 dark:text-indigo-400"
                >
                  Learn more <FiArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl bg-gray-50 p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <FiGift className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gift Cards</h3>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Buy and sell gift cards for your favorite retailers at competitive rates.
                </p>
                <Link
                  href="/dashboard/gift-cards"
                  className="mt-6 inline-flex items-center text-indigo-600 dark:text-indigo-400"
                >
                  Learn more <FiArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              {/* Feature 4 */}
              <div className="rounded-xl bg-gray-50 p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <FiMessageCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">SMM Services</h3>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Boost your social media presence with our comprehensive marketing services.
                </p>
                <Link
                  href="/dashboard/smm"
                  className="mt-6 inline-flex items-center text-indigo-600 dark:text-indigo-400"
                >
                  Learn more <FiArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              {/* Feature 5 */}
              <div className="rounded-xl bg-gray-50 p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <FiShield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Secure Wallet</h3>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Manage your funds securely with our integrated wallet system.
                </p>
                <Link
                  href="/dashboard/wallet"
                  className="mt-6 inline-flex items-center text-indigo-600 dark:text-indigo-400"
                >
                  Learn more <FiArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              {/* Feature 6 */}
              <div className="rounded-xl bg-gray-50 p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fast & Reliable</h3>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Experience lightning-fast service delivery with our automated systems.
                </p>
                <Link
                  href="/blog"
                  className="mt-6 inline-flex items-center text-indigo-600 dark:text-indigo-400"
                >
                  Learn more <FiArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 dark:bg-indigo-900">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-200">Create your account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Sign up
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-5 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16 dark:bg-gray-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Trusted by users worldwide
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300">
              See what our customers have to say
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-xl bg-gray-50 p-8 shadow-lg dark:bg-gray-800">
              <div className="flex items-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500">
                  <span className="text-lg font-bold text-white">J</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">John D.</h3>
                  <p className="text-gray-500 dark:text-gray-400">Digital Nomad</p>
                </div>
              </div>
              <p className="mt-6 text-gray-500 dark:text-gray-400">
                "SocialBlast's eSIM service has been a game-changer for my travels. I can stay connected anywhere without the hassle of physical SIM cards."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-xl bg-gray-50 p-8 shadow-lg dark:bg-gray-800">
              <div className="flex items-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500">
                  <span className="text-lg font-bold text-white">S</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sarah M.</h3>
                  <p className="text-gray-500 dark:text-gray-400">Small Business Owner</p>
                </div>
              </div>
              <p className="mt-6 text-gray-500 dark:text-gray-400">
                "The SMM services helped me grow my business's social media presence significantly. The results speak for themselves!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-xl bg-gray-50 p-8 shadow-lg dark:bg-gray-800">
              <div className="flex items-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500">
                  <span className="text-lg font-bold text-white">R</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Robert K.</h3>
                  <p className="text-gray-500 dark:text-gray-400">Privacy Advocate</p>
                </div>
              </div>
              <p className="mt-6 text-gray-500 dark:text-gray-400">
                "I use temporary phone numbers for all my online accounts. It's the perfect solution for maintaining privacy in the digital age."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400 dark:text-gray-300">
                &copy; 2023 SocialBlast. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
