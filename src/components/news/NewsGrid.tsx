import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { Post, ApiResponse } from "~/types/post";

export const NewsGrid = component$(() => {
  const posts = useSignal<Post[]>([]);
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);
  const page = useSignal(1);
  const isLoadingMore = useSignal(false);

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

  // Fetch posts dari API
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

  // Load more posts
  const loadMore = $(async () => {
    if (isLoadingMore.value) return;
    
    try {
      isLoadingMore.value = true;
      page.value++;
      
      const response = await fetch(`http://localhost:3000/posts?page=${page.value}`);
      if (!response.ok) throw new Error('Gagal mengambil data tambahan');
      
      const result: ApiResponse<Post[]> = await response.json();
      if (!result.success) throw new Error(result.message);
      
      posts.value = [...posts.value, ...result.data];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan';
    } finally {
      isLoadingMore.value = false;
    }
  });

  return (
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Berita Terkini</h2>
        
        {isLoading.value ? (
          <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error.value ? (
          <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
            <p>{error.value}</p>
          </div>
        ) : (
          <>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.value.map((post) => (
                <article key={post.id} class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div class="relative">
                    <img
                      src={post.coverImage ? `http://localhost:3000${post.coverImage}` : "https://via.placeholder.com/400x300"}
                      alt={post.title}
                      class="w-full h-48 object-cover"
                    />
                  </div>
                  <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p class="text-gray-600 mb-4 line-clamp-3">
                      {post.content}
                    </p>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-500">{formatDate(post.createdAt)}</span>
                      <span class="text-gray-400">{calculateReadTime(post.content)} baca</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {posts.value.length > 0 && (
              <div class="text-center mt-10">
                <button 
                  onClick$={loadMore}
                  disabled={isLoadingMore.value}
                  class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {isLoadingMore.value ? 'Memuat...' : 'Muat Lebih Banyak'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}); 