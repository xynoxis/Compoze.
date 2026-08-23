import { apiRequest } from './client';

export interface CommentDto {
  id: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  parentId: string | null;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchPostComments(postId: string): Promise<CommentDto[]> {
  return apiRequest<CommentDto[]>(`/posts/${postId}/comments`);
}

export async function addComment(postId: string, content: string): Promise<CommentDto> {
  return apiRequest<CommentDto>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function replyToComment(commentId: string, content: string): Promise<CommentDto> {
  return apiRequest<CommentDto>(`/comments/${commentId}/replies`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment(commentId: string): Promise<void> {
  return apiRequest<void>(`/comments/${commentId}`, {
    method: 'DELETE',
  });
}
