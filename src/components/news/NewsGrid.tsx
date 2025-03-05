import { component$ } from "@builder.io/qwik";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  author: string;
  date: string;
  readTime: string;
}

export const NewsGrid = component$(() => {
  // Dummy data untuk contoh
  const newsItems: NewsItem[] = [
    {
      id: "1",
      title: "Startup Indonesia Raih Pendanaan Series A Rp 100 Miliar",
      excerpt: "Startup teknologi finansial asal Indonesia berhasil mendapatkan pendanaan besar dari investor global...",
      category: "Bisnis",
      imageUrl: "https://via.placeholder.com/400x300",
      author: "Sarah Johnson",
      date: "5 Maret 2024",
      readTime: "4 menit",
    },
    {
      id: "2",
      title: "Inovasi Baru dalam Pengembangan Energi Terbarukan",
      excerpt: "Penemuan terbaru dalam teknologi panel surya menjanjikan efisiensi yang lebih tinggi...",
      category: "Teknologi",
      imageUrl: "https://via.placeholder.com/400x300",
      author: "David Chen",
      date: "5 Maret 2024",
      readTime: "3 menit",
    },
    {
      id: "3",
      title: "Tips Menjaga Kesehatan Mental di Era Digital",
      excerpt: "Para ahli kesehatan mental membagikan strategi efektif untuk menjaga keseimbangan di era digital...",
      category: "Lifestyle",
      imageUrl: "https://via.placeholder.com/400x300",
      author: "Maria Garcia",
      date: "4 Maret 2024",
      readTime: "5 menit",
    },
    // Tambahkan lebih banyak item berita sesuai kebutuhan
  ];

  return (
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Berita Terkini</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <article key={item.id} class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div class="relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  class="w-full h-48 object-cover"
                />
                <span class="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  {item.category}
                </span>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p class="text-gray-600 mb-4 line-clamp-3">
                  {item.excerpt}
                </p>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">{item.author}</span>
                  <div class="flex items-center space-x-2 text-gray-400">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div class="text-center mt-10">
          <button class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Muat Lebih Banyak
          </button>
        </div>
      </div>
    </section>
  );
}); 