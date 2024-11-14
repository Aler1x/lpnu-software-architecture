import { APIErrorResponse } from '@/types/types';
import { auth  } from '@clerk/nextjs/server';

export async function fetchServer<T>(path: string, options?: RequestInit): Promise<T> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { getToken } = await auth();
  const token = await getToken();
  try {
    const url = `${API_URL}/${path}`;

    options = {
      ...options,
      headers: {  
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
        'Authorization': `Bearer ${token}`,
      }
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `Request failed with status: ${response.status}`;

      try {
        const errorData = await response.json() as APIErrorResponse;
        if (errorData && errorData.message) {
          errorMessage += `, Error: ${errorData.message}`;
        }
      } catch (error) {
        throw new Error(errorMessage + `. Error parsing JSON data: ${error}`);
      }

      throw new Error(errorMessage);
    }

    const jsonData = await response.json() as T;
    return jsonData;
  } catch (error) {
    throw new Error(`Error fetching JSON data: ${error}. URL: ${API_URL}/${path}`);
  }
}

