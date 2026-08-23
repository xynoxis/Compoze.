import { apiRequest } from './client';

export interface LikeResponseDto {
  liked: boolean;
  count: number;
}

export async function getLikeStatus(postId: string): Promise<LikeResponseDto> {
  return apiRequest<LikeResponseDto>(`/posts/${postId}/like`);
}

export async function likePost(postId: string): Promise<LikeResponseDto> {
  return apiRequest<LikeResponseDto>(`/posts/${postId}/like`, {
    method: 'POST',
  });
}

export async function unlikePost(postId: string): Promise<LikeResponseDto> {
  return apiRequest<LikeResponseDto>(`/posts/${postId}/like`, {
    method: 'DELETE',
  });
}
