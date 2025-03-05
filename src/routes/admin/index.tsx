import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { Post, ApiResponse } from "~/types/post";

const FALLBACK_IMAGE = "https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image";

export default component$(() => {
  const posts = useSignal<Post[]>([]);
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);
  const showForm = useSignal(false);
  const editingPost = useSignal<Post | null>(null);
  const imagePreview = useSignal<string | null>(null);

  // Form fields
  const title = useSignal("");
  const content = useSignal("");
  const coverImage = useSignal<File | null>(null);

  // Fetch posts
  useVisibleTask$(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/posts');
      if (!response.ok) throw new Error('Gagal mengambil data');
      
      const result = await response.json();
      posts.value = result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan';
    } finally {
      isLoading.value = false;
    }
  });

  // Handle image change
  const handleImageChange = $((event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      coverImage.value = file;
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle form submit
  const handleSubmit = $(async (e: Event) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('title', title.value);
      formData.append('content', content.value);
      if (coverImage.value) {
        formData.append('coverImage', coverImage.value);
      }

      const url = editingPost.value 
        ? `http://localhost:3000/api/posts/${editingPost.value.id}`
        : 'http://localhost:3000/api/posts';
      
      console.log('Submitting form data:', {
        title: title.value,
        content: content.value,
        coverImage: coverImage.value ? coverImage.value.name : 'no image'
      });
      
      const response = await fetch(url, {
        method: editingPost.value ? 'PUT' : 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan data');
      }
      
      // Refresh posts
      const refreshResponse = await fetch('http://localhost:3000/api/posts');
      const result = await refreshResponse.json();
      
      posts.value = result;
      
      // Reset form
      showForm.value = false;
      editingPost.value = null;
      title.value = "";
      content.value = "";
      coverImage.value = null;
      imagePreview.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan';
    }
  });

  // Handle edit post
  const handleEdit = $((post: Post) => {
    editingPost.value = post;
    title.value = post.title;
    content.value = post.content;
    showForm.value = true;
    
    // Set preview for existing image
    if (post.coverImage) {
      imagePreview.value = `http://localhost:3000${post.coverImage}`;
    } else {
      imagePreview.value = null;
    }
  });

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Kelola Konten</h1>
        <button
          onClick$={() => {
            showForm.value = true;
            editingPost.value = null;
            title.value = "";
            content.value = "";
            coverImage.value = null;
            imagePreview.value = null;
          }}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tambah Berita Baru
        </button>
      </div>

      {showForm.value && (
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-bold mb-6">
              {editingPost.value ? 'Edit Berita' : 'Tambah Berita Baru'}
            </h2>
            
            <form onSubmit$={handleSubmit} class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Judul
                </label>
                <input
                  type="text"
                  value={title.value}
                  onChange$={(e) => title.value = (e.target as HTMLInputElement).value}
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Konten
                </label>
                <textarea
                  value={content.value}
                  onChange$={(e) => content.value = (e.target as HTMLTextAreaElement).value}
                  rows={6}
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Cover
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange$={handleImageChange}
                  class="w-full"
                />
                {imagePreview.value && (
                  <div class="mt-4 relative aspect-[16/9] rounded-lg overflow-hidden">
                    <img
                      src={imagePreview.value}
                      alt="Preview"
                      class="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div class="flex justify-end gap-4">
                <button
                  type="button"
                  onClick$={() => showForm.value = false}
                  class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingPost.value ? 'Simpan Perubahan' : 'Tambah Berita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading.value ? (
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error.value ? (
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
          <p>{error.value}</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 gap-6">
          {posts.value.map((post) => (
            <div key={post.id} class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="flex">
                <div class="w-48 h-48 flex-shrink-0">
                  <img
                    src={post.coverImage ? `http://localhost:3000${post.coverImage}` : FALLBACK_IMAGE}
                    alt={post.title}
                    class="w-full h-full object-cover"
                    onError$={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
                <div class="flex-1 p-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p class="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                  <div class="flex items-center gap-4">
                    <button
                      onClick$={() => handleEdit(post)}
                      class="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick$={async () => {
                        if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
                          try {
                            const response = await fetch(`http://localhost:3000/api/posts/${post.id}`, {
                              method: 'DELETE'
                            });
                            if (!response.ok) throw new Error('Gagal menghapus data');
                            posts.value = posts.value.filter(p => p.id !== post.id);
                          } catch (err) {
                            error.value = err instanceof Error ? err.message : 'Terjadi kesalahan';
                          }
                        }
                      }}
                      class="text-red-600 hover:text-red-700 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}); 