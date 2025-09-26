import Link from "next/link";
import { FiCalendar, FiUser, FiArrowRight, FiSearch, FiTag } from "react-icons/fi";

// Mock blog data - would be fetched from Supabase in production
const blogPosts = [
  {
    id: 1,
    title: "Introducing SocialBlast: Your All-in-One Digital Services Hub",
    excerpt: "We're excited to announce the launch of SocialBlast, your one-stop solution for temporary phone numbers, eSIMs, gift cards, and SMM services.",
    author: "SocialBlast Team",
    date: "June 15, 2023",
    category: "Announcements",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80"
  },
  {
    id: 2,
    title: "How to Use Temporary Phone Numbers for Online Verification",
    excerpt: "Learn how to protect your privacy and secure your online accounts using our temporary phone number service for verification codes.",
    author: "Privacy Expert",
    date: "June 20, 2023",
    category: "Tutorials",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 3,
    title: "The Ultimate Guide to eSIMs for International Travel",
    excerpt: "Planning an international trip? Discover how eSIMs can save you money and hassle while staying connected abroad.",
    author: "Travel Tech Advisor",
    date: "June 25, 2023",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 4,
    title: "Boost Your Social Media Presence with SMM Services",
    excerpt: "Learn effective strategies to grow your social media following and engagement using our SMM services.",
    author: "Digital Marketing Specialist",
    date: "July 2, 2023",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80"
  },
  {
    id: 5,
    title: "Gift Card Market Trends: What's Hot in 2023",
    excerpt: "Explore the latest trends in the gift card market and discover opportunities for buying and selling gift cards on our platform.",
    author: "Market Analyst",
    date: "July 10, 2023",
    category: "Market Insights",
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 6,
    title: "Security Updates: Keeping Your Digital Assets Safe",
    excerpt: "Learn about our latest security enhancements and best practices to protect your account and digital assets on SocialBlast.",
    author: "Security Team",
    date: "July 15, 2023",
    category: "Security",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  }
];

// Extract unique categories for filter
const categories = [...new Set(blogPosts.map(post => post.category))];

export default function BlogPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header with Search */}
        <div className="relative mb-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-16 text-center shadow-lg dark:from-indigo-800 dark:to-purple-900">
          <div className="absolute inset-0 opacity-10"></div>
          <div className="relative">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              SocialBlast Blog
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-indigo-100">
              Latest news, tutorials, and updates from the SocialBlast team
            </p>
            
            <div className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 bg-white py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="Search articles..."
                />
              </div>
              
              <div className="mt-4 flex flex-wrap justify-center space-x-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                  >
                    <FiTag className="mr-1 h-3 w-3" />
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-16 overflow-hidden rounded-xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-gray-800">
          <div className="md:flex">
            <div className="md:shrink-0 md:w-2/5">
              <img
                className="h-64 w-full object-cover md:h-full"
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
              />
            </div>
            <div className="p-8 md:w-3/5">
              <div className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {blogPosts[0].category}
              </div>
              <Link
                href={`/blog/${blogPosts[0].id}`}
                className="mt-2 block text-2xl font-bold leading-tight text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 transition-colors"
              >
                {blogPosts[0].title}
              </Link>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                {blogPosts[0].excerpt}
              </p>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white">
                    {blogPosts[0].author.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {blogPosts[0].author}
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>{blogPosts[0].date}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>5 min read</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href={`/blog/${blogPosts[0].id}`}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                >
                  Read full article
                  <FiArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Post Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.slice(1).map((post) => (
            <div
              key={post.id}
              className="group overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
            >
              <div className="relative overflow-hidden">
                <img
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={post.image}
                  alt={post.title}
                />
                <div className="absolute top-4 right-4">
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/70 dark:text-indigo-200">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <Link
                  href={`/blog/${post.id}`}
                  className="mt-2 block text-xl font-bold leading-tight text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 transition-colors"
                >
                  {post.title}
                </Link>
                <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      {post.author.charAt(0)}
                    </span>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {post.author}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {post.date}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  >
                    Read more
                    <FiArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-10 shadow-lg dark:from-indigo-800 dark:to-purple-900 sm:py-12 sm:px-12">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Subscribe to our newsletter
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-indigo-100">
                Stay updated with the latest news, tutorials, and special offers from SocialBlast.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <form className="sm:flex">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-md border-0 px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 sm:max-w-xs"
                  placeholder="Enter your email"
                />
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-700 transition-colors"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}