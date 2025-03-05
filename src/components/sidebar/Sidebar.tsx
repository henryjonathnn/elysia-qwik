import { component$ } from "@builder.io/qwik";

interface PopularNews {
  id: string;
  title: string;
  views: string;
  imageUrl: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

export const Sidebar = component$(() => {
  const popularNews: PopularNews[] = [
    {
      id: "1",
      title: "Perkembangan Ekonomi Digital Indonesia di Tahun 2024",
      views: "10.5K",
      imageUrl: "https://via.placeholder.com/100",
    },
    {
      id: "2",
      title: "5 Tren Teknologi yang Akan Mengubah Industri",
      views: "8.2K",
      imageUrl: "https://via.placeholder.com/100",
    },
    {
      id: "3",
      title: "Cara Efektif Mengelola Keuangan di Masa Inflasi",
      views: "7.8K",
      imageUrl: "https://via.placeholder.com/100",
    },
  ];

  const categories: Category[] = [
    { id: "1", name: "Teknologi", count: 128 },
    { id: "2", name: "Bisnis", count: 85 },
    { id: "3", name: "Lifestyle", count: 74 },
    { id: "4", name: "Kesehatan", count: 63 },
    { id: "5", name: "Olahraga", count: 42 },
  ];

  return (
    <aside class="w-full lg:w-80 space-y-8">
      {/* Popular News Section */}
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Berita Populer</h3>
        <div class="space-y-6">
          {popularNews.map((news, index) => (
            <div key={news.id} class="flex items-start space-x-4">
              <span class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {index + 1}
              </span>
              <div class="flex-grow">
                <h4 class="text-gray-900 font-medium line-clamp-2 hover:text-blue-600 cursor-pointer">
                  {news.title}
                </h4>
                <p class="text-sm text-gray-500 mt-1">{news.views} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Kategori</h3>
        <div class="space-y-4">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/kategori/${category.name.toLowerCase()}`}
              class="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span class="text-gray-700">{category.name}</span>
              <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {category.count}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md p-6 text-white">
        <h3 class="text-xl font-bold mb-4">Berlangganan Newsletter</h3>
        <p class="text-blue-100 mb-6">
          Dapatkan berita terbaru langsung di inbox Anda setiap minggu!
        </p>
        <div class="space-y-3">
          <input
            type="email"
            placeholder="Masukkan email Anda"
            class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button class="w-full px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
            Berlangganan
          </button>
        </div>
      </div>
    </aside>
  );
});