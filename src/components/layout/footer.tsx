'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-8 mt-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0 flex">
          <p className="text-sm flex text-center items-center">
            © {new Date().getFullYear()}
            Created with ❤️ by [seyed mohammad siadati] |{' '}
            <Link
              href="https://github.com/mohammadSiadati"
              className="text-blue-400"
            >
              Visit my GitHub
            </Link>
          </p>
        </div>
        <div className="flex gap-6 items-center text-sm">
          <Link
            href="#"
            className="hover:text-gray-200 transition duration-300 transform hover:scale-105"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="hover:text-gray-200 transition duration-300 transform hover:scale-105"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="hover:text-gray-200 transition duration-300 transform hover:scale-105"
          >
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
