import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { Post, ApiResponse } from "~/types/post";

// Fallback image jika gambar tidak tersedia
const FALLBACK_IMAGE = "https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image";

export default component$(() => {
  const posts = useSignal<Post[]>([]);
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);
  const activeCategory = useSignal<string>("all");

  // Helper function untuk handle image URL
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return FALLBACK_IMAGE;
    // Jika path dimulai dengan http, gunakan langsung
    if (imagePath.startsWith('http')) return imagePath;
    // Jika tidak, tambahkan base URL API
    return `http://localhost:3000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  // Fetch posts
  useVisibleTask$(async () => {
    try {
      const response = await fetch('http://localhost:3000/posts');
      if (!response.ok) throw new Error('Gagal mengambil data');
      
      const result: ApiResponse<Post[]> = await response.json();
      if (!result.success) throw new Error(result.message);
      
      posts.value = result.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan';
    } finally {
      isLoading.value = false;
    }
  });

  const categories = [
    { id: "all", name: "Semua", color: "bg-gray-100 text-gray-800" },
    { id: "tech", name: "Teknologi", color: "bg-blue-100 text-blue-800" },
    { id: "business", name: "Bisnis", color: "bg-green-100 text-green-800" },
    { id: "lifestyle", name: "Lifestyle", color: "bg-purple-100 text-purple-800" },
  ];

  return (
    <main class="min-h-screen bg-gray-50">
      {/* Featured Post */}
      {posts.value[0] && (
        <div class="relative h-[70vh] overflow-hidden">
          <div class="absolute inset-0">
            <img
              src={getImageUrl(posts.value[0].coverImage)}
              alt={posts.value[0].title}
              class="w-full h-full object-cover"
              onError$={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = FALLBACK_IMAGE;
              }}
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>
          <div class="relative container mx-auto px-4 h-full flex items-end pb-16">
            <div class="max-w-3xl text-white">
              <span class="inline-block px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full mb-4">
                Berita Utama
              </span>
              <h1 class="text-4xl md:text-5xl font-bold mb-4">
                {posts.value[0].title}
              </h1>
              <p class="text-lg text-gray-200 mb-6 line-clamp-2">
                {posts.value[0].content}
              </p>
              <div class="flex items-center text-sm text-gray-300">
                <span>{new Date(posts.value[0].createdAt).toLocaleDateString('id-ID')}</span>
                <span class="mx-2">•</span>
                <span>{Math.ceil(posts.value[0].content.split(/\s+/).length / 200)} menit baca</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div class="sticky top-0 bg-white/80 backdrop-blur-lg border-b z-10">
        <div class="container mx-auto px-4">
          <div class="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick$={() => activeCategory.value = category.id}
                class={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${activeCategory.value === category.id 
                    ? category.color
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div class="container mx-auto px-4 py-12">
        {isLoading.value ? (
          <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error.value ? (
          <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>{error.value}</p>
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.value.slice(1).map((post) => (
              <article 
                key={post.id} 
                class="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div class="aspect-video overflow-hidden">
                  <img
                    src={getImageUrl(post.coverImage)}
                    alt={post.title}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError$={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
                <div class="p-6">
                  <h2 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p class="text-gray-600 mb-4 line-clamp-3">
                    {post.content}
                  </p>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('id-ID')}
                    </span>
                    <span class="text-gray-400">
                      {Math.ceil(post.content.split(/\s+/).length / 200)} menit baca
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Admin Link */}
      <div class="fixed bottom-4 right-4">
        <a
          href="/admin"
          class="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur text-white rounded-full hover:bg-black/90 transition-colors shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Kelola Konten
        </a>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "NewsPortal - Portal Berita Modern Indonesia",
  meta: [
    {
      name: "description",
      content: "Portal berita modern Indonesia yang menyajikan informasi terkini dengan akurat dan berimbang",
    },
    {
      name: "keywords",
      content: "berita, news, portal berita, indonesia, teknologi, bisnis, lifestyle",
    },
  ],
};