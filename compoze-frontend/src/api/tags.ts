import { apiRequest } from './client';

export interface TagDto {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export async function fetchAllTags(): Promise<TagDto[]> {
  return apiRequest<TagDto[]>('/tags');
}

export async function attachTagToPost(postId: string, tagName: string): Promise<TagDto> {
  return apiRequest<TagDto>(`/posts/${postId}/tags`, {
    method: 'POST',
    body: JSON.stringify({ name: tagName }),
  });
}

export async function removeTagFromPost(postId: string, tagId: string): Promise<void> {
  return apiRequest<void>(`/posts/${postId}/tags/${tagId}`, {
    method: 'DELETE',
  });
}
