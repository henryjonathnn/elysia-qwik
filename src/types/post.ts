export interface Post {
  id: number;
  title: string;
  content: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
} 