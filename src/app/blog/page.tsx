import Link from "next/link";
import { FiCalendar, FiUser, FiArrowRight } from "react-icons/fi";

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

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          SocialBlast Blog
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
          Latest news, tutorials, and updates from the SocialBlast team
        </p>
      </div>

      {/* Featured Post */}
      <div className="mt-12 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
        <div className="md:flex">
          <div className="md:shrink-0">
            <img
              className="h-48 w-full object-cover md:h-full md:w-48"
              src={blogPosts[0].image}
              alt={blogPosts[0].title}
            />
          </div>
          <div className="p-8">
            <div className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              {blogPosts[0].category}
            </div>
            <Link
              href={`/blog/${blogPosts[0].id}`}
              className="mt-1 block text-2xl font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
            >
              {blogPosts[0].title}
            </Link>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {blogPosts[0].excerpt}
            </p>
            <div className="mt-4 flex items-center">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <FiUser className="mr-1" />
                {blogPosts[0].author}
              </div>
              <div className="ml-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <FiCalendar className="mr-1" />
                {blogPosts[0].date}
              </div>
            </div>
            <div className="mt-6">
              <Link
                href={`/blog/${blogPosts[0].id}`}
                className="inline-flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Read full article
                <FiArrowRight className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Post Grid */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.slice(1).map((post) => (
          <div
            key={post.id}
            className="overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
          >
            <img
              className="h-48 w-full object-cover"
              src={post.image}
              alt={post.title}
            />
            <div className="p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                {post.category}
              </div>
              <Link
                href={`/blog/${post.id}`}
                className="mt-2 block text-xl font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
              >
                {post.title}
              </Link>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiUser className="mr-1" />
                  {post.author}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiCalendar className="mr-1" />
                  {post.date}
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Read more
                  <FiArrowRight className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Subscription */}
      <div className="mt-16 rounded-lg bg-indigo-600 px-6 py-10 dark:bg-indigo-800 sm:py-12 sm:px-12">
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
                className="w-full rounded-md border-white px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 sm:max-w-xs"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-700"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <p className="mt-3 text-sm text-indigo-100">
              We care about your data. Read our{" "}
              <Link href="/privacy-policy" className="font-medium text-white underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}