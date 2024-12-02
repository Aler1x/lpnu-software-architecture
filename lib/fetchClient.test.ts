import { fetchClient } from './fetchClient';

describe('fetchClient', () => {
  const mockPath = 'test-endpoint';
  const mockToken = 'mock-token';
  const mockAPI_URL = 'http://mockapi.com';
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;

  beforeAll(() => {
    process.env.NEXT_PUBLIC_API_URL = mockAPI_URL;
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });

  it('makes a successful GET request', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock;
  
    const response = await fetchClient(mockPath, mockToken, 'GET');
    expect(response).toEqual({ success: true });
  
    expect(global.fetch).toHaveBeenCalledWith(`${mockAPI_URL}/${mockPath}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json', // Ensure Accept matches
        Authorization: `Bearer ${mockToken}`,
      },
      body: undefined, // Explicitly include `body` as `undefined`
    });
  });
  

  it('throws an error when no token is provided', async () => {
    await expect(fetchClient(mockPath, '', 'GET')).rejects.toThrow('No token found');
  });
});
