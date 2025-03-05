import { component$ } from "@builder.io/qwik";

export const Navbar = component$(() => {
  return (
    <nav class="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          {/* Logo */}
          <div class="flex-shrink-0">
            <a href="/" class="text-2xl font-bold text-blue-600">
              NewsPortal
            </a>
          </div>

          {/* Desktop Navigation */}
          <div class="hidden md:flex space-x-8">
            <a href="/" class="text-gray-700 hover:text-blue-600 transition-colors">
              Beranda
            </a>
            <a href="/terbaru" class="text-gray-700 hover:text-blue-600 transition-colors">
              Terbaru
            </a>
            <a href="/populer" class="text-gray-700 hover:text-blue-600 transition-colors">
              Populer
            </a>
            <a href="/kategori" class="text-gray-700 hover:text-blue-600 transition-colors">
              Kategori
            </a>
          </div>

          {/* Search Bar */}
          <div class="hidden md:flex items-center">
            <div class="relative">
              <input
                type="text"
                placeholder="Cari berita..."
                class="w-64 px-4 py-1 text-sm text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button class="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  class="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div class="md:hidden">
            <button class="text-gray-700 hover:text-blue-600">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}); 