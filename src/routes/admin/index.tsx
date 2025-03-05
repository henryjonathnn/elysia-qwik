import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { Post, ApiResponse } from "~/types/post";

export default component$(() => {
  const posts = useSignal<Post[]>([]);
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);
  const showForm = useSignal(false);
  const editingPost = useSignal<Post | null>(null);

  // Form fields
  const title = useSignal("");
  const content = useSignal("");
  const coverImage = useSignal<File | null>(null);

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

  // Handle create/edit post
  const handleSubmit = $(async () => {
    try {
      const formData = new FormData();
      formData.append('title', title.value);
      formData.append('content', content.value);
      if (coverImage.value) {
        formData.append('coverImage', coverImage.value);
      }

      const url = editingPost.value 
        ? `http://localhost:3000/posts/${editingPost.value.id}`
        : 'http://localhost:3000/posts';

      const response = await fetch(url, {
        method: editingPost.value ? 'PUT' : 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Gagal menyimpan post');
      
      // Refresh posts list
      const refreshResponse = await fetch('http://localhost:3000/posts');
      const result: ApiResponse<Post[]> = await refreshResponse.json();
      posts.value = result.data;

      // Reset form
      title.value = "";
      content.value = "";
      coverImage.value = null;
      showForm.value = false;
      editingPost.value = null;

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan';
    }
  });

  // Handle delete post
  const handleDelete = $(async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus post ini?')) return;

    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Gagal menghapus post');
      
      // Refresh posts list
      posts.value = posts.value.filter(post => post.id !== id);
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
  });

  return (
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Kelola Konten</h1>
          <button
            onClick$={() => {
              showForm.value = true;
              editingPost.value = null;
              title.value = "";
              content.value = "";
            }}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tambah Post Baru
          </button>
        </div>

        {/* Form */}
        {showForm.value && (
          <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 class="text-xl font-semibold mb-4">
              {editingPost.value ? 'Edit Post' : 'Post Baru'}
            </h2>
            <form preventdefault:submit onSubmit$={handleSubmit} class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Judul
                </label>
                <input
                  type="text"
                  value={title.value}
                  onChange$={(e) => title.value = (e.target as HTMLInputElement).value}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Konten
                </label>
                <textarea
                  value={content.value}
                  onChange$={(e) => content.value = (e.target as HTMLTextAreaElement).value}
                  rows={5}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange$={(e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files && files.length > 0) {
                      coverImage.value = files[0];
                    }
                  }}
                  class="w-full"
                />
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick$={() => showForm.value = false}
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingPost.value ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        {isLoading.value ? (
          <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error.value ? (
          <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>{error.value}</p>
          </div>
        ) : (
          <div class="grid gap-6">
            {posts.value.map((post) => (
              <div key={post.id} class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="p-6">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p class="text-gray-600 line-clamp-2 mb-4">
                        {post.content}
                      </p>
                      <p class="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div class="flex space-x-2">
                      <button
                        onClick$={() => handleEdit(post)}
                        class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick$={() => handleDelete(post.id)}
                        class="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
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
    </div>
  );
}); 