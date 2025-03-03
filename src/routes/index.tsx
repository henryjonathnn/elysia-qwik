import { component$, useSignal, useVisibleTask$, $, useStore, noSerialize } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import { Post, ApiResponse } from '~/types';

export default component$(() => {
  const posts = useSignal<Post[]>([]);
  const isLoading = useSignal(true);
  const error = useSignal('');
  const isModalOpen = useSignal(false);
  const currentPost = useSignal<Post | null>(null);
  const isEditing = useSignal(false);
  
  // Form state
  const title = useSignal('');
  const content = useSignal('');
  const coverImagePreview = useSignal('');
  const imageFile = useStore({
    file: null as any
  });

  // Fetch posts from API
  useVisibleTask$(async () => {
    try {
      isLoading.value = true;
      const response = await fetch('http://localhost:3000/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data: ApiResponse = await response.json();
      posts.value = data.data || [];
    } catch (err) {
      console.error('Error fetching posts:', err);
      error.value = err instanceof Error ? err.message : 'An unknown error occurred';
    } finally {
      isLoading.value = false;
    }
  });

  // Handle file change
  const handleFileChange = $((e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Use noSerialize to prevent serialization of the File object
    imageFile.file = noSerialize(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      coverImagePreview.value = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });

  // Create a new post
  const createPost = $(async () => {
    try {
      if (!title.value.trim() || !content.value.trim()) {
        error.value = 'Title and content are required';
        return;
      }

      const formData = new FormData();
      formData.append('title', title.value);
      formData.append('content', content.value);
      
      if (imageFile.file) {
        formData.append('coverImage', imageFile.file);
      }

      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create post');

      const data = await response.json();
      posts.value = [data.data, ...posts.value];
      
      // Reset form and close modal
      title.value = '';
      content.value = '';
      coverImagePreview.value = '';
      imageFile.file = null;
      isModalOpen.value = false;
    } catch (err) {
      console.error('Error creating post:', err);
      error.value = err instanceof Error ? err.message : 'An unknown error occurred';
    }
  });

  // Update an existing post
  const updatePost = $(async () => {
    try {
      if (!currentPost.value?.id) return;
      if (!title.value.trim() || !content.value.trim()) {
        error.value = 'Title and content are required';
        return;
      }

      const formData = new FormData();
      formData.append('title', title.value);
      formData.append('content', content.value);
      
      if (imageFile.file) {
        formData.append('coverImage', imageFile.file);
      }

      const response = await fetch(`http://localhost:3000/api/posts/${currentPost.value.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update post');

      const data = await response.json();
      
      // Update post in the posts array
      posts.value = posts.value.map(post => 
        post.id === currentPost.value?.id ? data.data : post
      );
      
      // Reset form and close modal
      title.value = '';
      content.value = '';
      coverImagePreview.value = '';
      imageFile.file = null;
      currentPost.value = null;
      isEditing.value = false;
      isModalOpen.value = false;
    } catch (err) {
      console.error('Error updating post:', err);
      error.value = err instanceof Error ? err.message : 'An unknown error occurred';
    }
  });

  // Delete a post
  const deletePost = $(async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');

      // Remove post from the posts array
      posts.value = posts.value.filter(post => post.id !== id);
    } catch (err) {
      console.error('Error deleting post:', err);
      error.value = err instanceof Error ? err.message : 'An unknown error occurred';
    }
  });

  // Open modal for editing a post
  const editPost = $((post: Post) => {
    currentPost.value = post;
    title.value = post.title;
    content.value = post.content;
    
    // Set image preview if cover image exists
    if (post.coverImage) {
      coverImagePreview.value = `http://localhost:3000${post.coverImage}`;
    } else {
      coverImagePreview.value = '';
    }
    
    imageFile.file = null;
    isEditing.value = true;
    isModalOpen.value = true;
  });

  // Open modal for creating a new post
  const openCreateModal = $(() => {
    title.value = '';
    content.value = '';
    coverImagePreview.value = '';
    imageFile.file = null;
    isEditing.value = false;
    isModalOpen.value = true;
  });

  // Close modal
  const closeModal = $(() => {
    isModalOpen.value = false;
    isEditing.value = false;
    currentPost.value = null;
    title.value = '';
    content.value = '';
    coverImagePreview.value = '';
    imageFile.file = null;
    error.value = '';
  });

  // Remove current image
  const removeImage = $(() => {
    coverImagePreview.value = '';
    imageFile.file = null;
  });

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header */}
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">Post Portal</h1>
            <button 
              onClick$={openCreateModal}
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              New Post
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading.value ? (
          <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error.value ? (
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error.value}</p>
          </div>
        ) : posts.value.length === 0 ? (
          <div class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
            <div class="mt-6">
              <button
                onClick$={openCreateModal}
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                New Post
              </button>
            </div>
          </div>
        ) : (
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.value.map((post) => (
              // Add null check for post
              post && post.id ? (
                <div key={post.id} class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                  {post.coverImage && (
                    <div class="w-full h-48 overflow-hidden">
                      <img 
                        src={`http://localhost:3000${post.coverImage}`} 
                        alt={post.title} 
                        class="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div class="p-6">
                    <h3 class="text-lg font-medium text-gray-900 truncate">{post.title}</h3>
                    <p class="mt-2 text-sm text-gray-500 line-clamp-3">{post.content}</p>
                    <div class="mt-4 flex justify-end space-x-3">
                      <button 
                        onClick$={() => editPost(post)}
                        class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Edit
                      </button>
                      <button 
                        onClick$={() => deletePost(post.id)}
                        class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        )}
      </main>

      {/* Modal for Create/Edit */}
      {isModalOpen.value && (
        <div class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick$={closeModal}
            ></div>

            {/* Modal panel */}
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {isEditing.value ? 'Edit Post' : 'Create New Post'}
                </h3>
                <div class="mt-4 space-y-4">
                  {error.value && (
                    <div class="bg-red-50 border-l-4 border-red-400 p-4">
                      <div class="flex">
                        <div class="ml-3">
                          <p class="text-sm text-red-700">{error.value}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      id="title"
                      value={title.value}
                      onInput$={(e: any) => title.value = e.target.value}
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter post title"
                    />
                  </div>
                  <div>
                    <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                      id="content"
                      value={content.value}
                      onInput$={(e: any) => content.value = e.target.value}
                      rows={4}
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter post content"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Cover Image</label>
                    {coverImagePreview.value ? (
                      <div class="mt-2 relative">
                        <img 
                          src={coverImagePreview.value} 
                          alt="Cover preview" 
                          class="h-48 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick$={removeImage}
                          class="absolute top-2 right-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div class="space-y-1 text-center">
                          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <div class="flex text-sm text-gray-600">
                            <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                              <span>Upload a file</span>
                              <input 
                                id="file-upload" 
                                name="file-upload" 
                                type="file" 
                                class="sr-only"
                                accept="image/*"
                                onChange$={handleFileChange}
                              />
                            </label>
                            <p class="pl-1">or drag and drop</p>
                          </div>
                          <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick$={isEditing.value ? updatePost : createPost}
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isEditing.value ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick$={closeModal}
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Post Portal',
  meta: [
    {
      name: 'description',
      content: 'A modern portal for managing posts',
    },
  ],
};