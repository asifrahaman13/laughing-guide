import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">My SaaS</div>
          <nav>
            <Link href="/dashboard">
              <div className="text-gray-800 hover:text-gray-600 mx-4">Dashboard</div>
            </Link>
            <Link href="/about">
              <div className="text-gray-800 hover:text-gray-600 mx-4">About</div>
            </Link>
            <Link href="/contact">
              <div className="text-gray-800 hover:text-gray-600 mx-4">Contact</div>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to My SaaS</h1>
          <p className="text-gray-600 mt-4">The best solution for your business needs.</p>
          <Link href="/signup">
            <div className="mt-8 inline-block bg-orange-600 text-white text-lg font-semibold px-6 py-3 rounded hover:bg-orange-500 transition duration-300">
              Get Started
            </div>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100">
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Features</h2>
          <div className="mt-8 flex flex-wrap">
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="text-xl font-semibold text-gray-800">Feature One</h3>
                <p className="text-gray-600 mt-2">Description of feature one.</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="text-xl font-semibold text-gray-800">Feature Two</h3>
                <p className="text-gray-600 mt-2">Description of feature two.</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="text-xl font-semibold text-gray-800">Feature Three</h3>
                <p className="text-gray-600 mt-2">Description of feature three.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 text-center">
          <p className="text-gray-600">&copy; 2023 My SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
