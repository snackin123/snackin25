import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Oops! Page Not Found</h1>
      <p className="text-lg text-gray-700 mb-6">
        Sorry, the page you are looking for doesn't exist. You can go back to the homepage or visit one of the following pages:
      </p>
      <ul className="space-y-3">
        <li>
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/Our-Story" className="text-blue-600 hover:underline">
            Our Story
          </Link>
        </li>
        <li>
          <Link href="/products" className="text-blue-600 hover:underline">
            Products
          </Link>
        </li>
        <li>
          <Link href="/contact-us" className="text-blue-600 hover:underline">
            Contact Us
          </Link>
        </li>
      </ul>
    </div>
  );
}
