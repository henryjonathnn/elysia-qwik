import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { Post, ApiResponse } from "~/types/post";

export const Hero = component$(() => {
  const featuredPost = useSignal<Post | null>(null);
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Fungsi untuk menghitung waktu baca
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} menit`;
  };

  // Fetch featured post dari API
  useVisibleTask$(async () => {
    try {
      const response = await fetch('http://localhost:3000/posts');
      if (!response.ok) throw new Error('Gagal mengambil data');
      
      const result: ApiResponse<Post[]> = await response.json();
      if (!result.success) throw new Error(result.message);
      
      // Mengambil post pertama sebagai featured post
      featuredPost.value = result.data[0] || null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan';
    } finally {
      isLoading.value = false;
    }
  });

  if (isLoading.value) {
    return (
      <section class="pt-20 pb-10 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error.value) {
    return (
      <section class="pt-20 pb-10 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>{error.value}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredPost.value) {
    return null;
  }

  return (
    <section class="pt-20 pb-10 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Main News */}
          <div class="space-y-4">
            <span class="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
              Berita Utama
            </span>
            <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {featuredPost.value.title}
            </h1>
            <p class="text-lg text-gray-600">
              {featuredPost.value.content}
            </p>
            <div class="flex items-center space-x-4">
              <div>
                <p class="text-sm text-gray-500">
                  {formatDate(featuredPost.value.createdAt)} • {calculateReadTime(featuredPost.value.content)} baca
                </p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div class="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <img
              src={featuredPost.value.coverImage ? `http://localhost:3000${featuredPost.value.coverImage}` : "https://via.placeholder.com/800x600"}
              alt={featuredPost.value.title}
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </div>

        {/* Quick Links */}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[
            { title: "Teknologi", color: "bg-blue-100 text-blue-600" },
            { title: "Bisnis", color: "bg-green-100 text-green-600" },
            { title: "Lifestyle", color: "bg-purple-100 text-purple-600" },
            { title: "Olahraga", color: "bg-orange-100 text-orange-600" },
          ].map((category) => (
            <a
              key={category.title}
              href={`/kategori/${category.title.toLowerCase()}`}
              class={`${category.color} rounded-lg p-4 text-center hover:opacity-90 transition-opacity`}
            >
              <h3 class="font-medium">{category.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}); 