import { apiRequest } from './client';

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
}

export interface PublicUserDto {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
}

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

export async function registerUser(payload: RegisterPayload): Promise<UserDto> {
  return apiRequest<UserDto>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload): Promise<TokenResponse> {
  return apiRequest<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function refreshToken(token: string): Promise<TokenResponse> {
  return apiRequest<TokenResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: token }),
  });
}

export async function getCurrentUser(): Promise<UserDto> {
  return apiRequest<UserDto>('/users/me', {
    method: 'GET',
  });
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<UserDto> {
  return apiRequest<UserDto>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function fetchPublicProfile(username: string): Promise<PublicUserDto> {
  return apiRequest<PublicUserDto>(`/users/${encodeURIComponent(username)}`, {
    method: 'GET',
  });
}
