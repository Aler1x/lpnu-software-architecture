import { APIErrorResponse } from '@/types/types';

export async function fetchClient<T>(
  path: string,
  token: string,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  body?: unknown,
  options?: RequestInit,
): Promise<T> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    if (!token) {
      throw new Error('No token found');
    }

    const url = `${API_URL}/${path}`;

    options = {
      ...options,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options?.headers || {}),
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `Request failed with status: ${response.status}`;

      try {
        const errorData = (await response.json()) as APIErrorResponse;
        if (errorData && errorData.message) {
          errorMessage += `, Error: ${errorData.message}`;
        }
      } catch (error) {
        throw new Error(errorMessage + `. Error parsing JSON data: ${error}`);
      }

      throw new Error(errorMessage);
    }

    const jsonData = (await response.json()) as T;
    return jsonData;
  } catch (error) {
    throw new Error(`Error fetching JSON data: ${error}. URL: ${API_URL}/${path}`);
  }
}
