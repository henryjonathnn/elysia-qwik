// src/types.ts
export interface Post {
    id: string;
    title: string;
    content: string;
    coverImage?: string | null;  // Path to cover image file
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ApiResponse {
    success: boolean;
    message: string;
    data: Post[] | Post | null;
  }