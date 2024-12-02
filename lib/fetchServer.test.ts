import { fetchServer } from './fetchServer';

// Declare mockGetToken outside so it can be modified per test
const mockGetToken = jest.fn();

jest.mock('@clerk/nextjs/server', () => ({
  auth: () => ({
    getToken: mockGetToken,
  }),
}));

describe('fetchServer', () => {
  const mockPath = 'test-endpoint';
  const mockAPI_URL = 'http://mockapi.com';
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;

  beforeAll(() => {
    process.env.NEXT_PUBLIC_API_URL = mockAPI_URL;
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });

  // Reset and set default behavior for mockGetToken before each test
  beforeEach(() => {
    mockGetToken.mockReset();
    mockGetToken.mockResolvedValue('mock-token');
  });

  it('makes a successful GET request', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      }),
    ) as jest.Mock;

    const response = await fetchServer(mockPath);
    expect(response).toEqual({ success: true });
    expect(global.fetch).toHaveBeenCalledWith(`${mockAPI_URL}/${mockPath}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token',
      },
    });
  });

  it('throws an error when token is missing', async () => {
    // Make getToken return undefined for this test
    mockGetToken.mockResolvedValueOnce(undefined);

    await expect(fetchServer(mockPath)).rejects.toThrow('No token found');
  });
});
