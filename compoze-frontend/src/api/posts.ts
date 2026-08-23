import { apiRequest } from './client';

export interface PostDto {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostPageDto {
  posts: PostDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CreatePostPayload {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
}

export interface UpdatePostPayload {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
}

export async function fetchPosts(page = 0, size = 10, tag?: string, query?: string): Promise<PostPageDto> {
  const queryParams = new URLSearchParams({ page: page.toString(), size: size.toString() });
  if (tag) queryParams.append('tag', tag);
  if (query) queryParams.append('query', query);
  return apiRequest<PostPageDto>(`/posts?${queryParams.toString()}`);
}

export async function fetchPostBySlug(slug: string): Promise<PostDto> {
  return apiRequest<PostDto>(`/posts/${encodeURIComponent(slug)}`);
}

export async function createPost(payload: CreatePostPayload): Promise<PostDto> {
  return apiRequest<PostDto>('/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updatePost(id: string, payload: UpdatePostPayload): Promise<PostDto> {
  return apiRequest<PostDto>(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function publishPost(id: string): Promise<PostDto> {
  return apiRequest<PostDto>(`/posts/${id}/publish`, {
    method: 'POST',
  });
}

export async function deletePost(id: string): Promise<void> {
  return apiRequest<void>(`/posts/${id}`, {
    method: 'DELETE',
  });
}

export async function togglePostBookmark(id: string): Promise<{ bookmarked: boolean }> {
  return apiRequest<{ bookmarked: boolean }>(`/posts/${id}/bookmark`, {
    method: 'POST',
  });
}

export async function fetchMyBookmarks(): Promise<PostDto[]> {
  return apiRequest<PostDto[]>('/posts/bookmarks/me');
}
