jest.mock('mongodb', () => {
  const mMongoClient = {
    connect: jest.fn().mockResolvedValue('MockedClient'),
  };
  return { MongoClient: jest.fn(() => mMongoClient) };
});

describe('MongoDB Client Module', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset modules and mocks before each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment variables after each test
    process.env = originalEnv;
  });

  it('throws an error if MONGODB_URI is not defined', async () => {
    delete process.env.MONGODB_URI;

    await expect(async () => {
      // Isolate module loading
      await jest.isolateModulesAsync(async () => {
        await import('./db'); // Adjust the path if necessary
      });
    }).rejects.toThrow('Invalid/Missing environment variable: "MONGODB_URI"');
  });

  it('creates a MongoClient when MONGODB_URI is defined', async () => {
    process.env.MONGODB_URI = 'mongodb://mockuri';

    await jest.isolateModulesAsync(async () => {
      // Mock 'mongodb' inside the isolated module
      jest.doMock('mongodb', () => {
        const mMongoClient = {
          connect: jest.fn().mockResolvedValue('MockedClient'),
        };
        return {
          MongoClient: jest.fn(() => mMongoClient),
        };
      });

      // Import the module under test
      const test_module = await import('./db'); // Adjust the path if necessary
      const clientPromise = test_module.default;

      // Get the mocked MongoClient
      const { MongoClient } = await import('mongodb');

      // Assert that MongoClient was called with correct arguments
      expect(MongoClient).toHaveBeenCalledWith('mongodb://mockuri', {});

      // Await the clientPromise and assert the resolved value
      const client = await clientPromise;
      expect(client).toBe('MockedClient');
    });
  });
});
