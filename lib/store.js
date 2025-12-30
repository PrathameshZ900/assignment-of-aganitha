import redis from './redis';

// Simple in-memory store for fallback
// Simple in-memory store for fallback
// Use globalThis to persist across module reloads in development
if (!globalThis.__memoryStore) globalThis.__memoryStore = new Map();
if (!globalThis.__expiryStore) globalThis.__expiryStore = new Map();

const memoryStore = globalThis.__memoryStore;
const expiryStore = globalThis.__expiryStore;

// Helper to check if Redis is ready
const isRedisReady = () => redis.status === 'ready';

// Clean up expired keys in memory (basic lazy implementation)
const checkMemoryExpiry = (key) => {
  if (expiryStore.has(key)) {
    if (Date.now() > expiryStore.get(key)) {
      memoryStore.delete(key);
      expiryStore.delete(key);
    }
  }
};

export const store = {
  async get(key) {
    if (isRedisReady()) {
      try {
        return await redis.get(key);
      } catch (e) {
        console.error('Redis get failed, falling back:', e);
      }
    }
    // Fallback
    checkMemoryExpiry(key);
    return memoryStore.get(key) || null;
  },

  async set(key, value) {
    if (isRedisReady()) {
      try {
        return await redis.set(key, value);
      } catch (e) {
        console.error('Redis set failed, falling back:', e);
      }
    }
    // Fallback
    memoryStore.set(key, value);
    return 'OK';
  },

  async setWithExpiry(key, value, seconds) {
    if (isRedisReady()) {
      try {
        return await redis.set(key, value, 'EX', seconds);
      } catch (e) {
        console.error('Redis setWithExpiry failed, falling back:', e);
      }
    }
    // Fallback
    memoryStore.set(key, value);
    expiryStore.set(key, Date.now() + (seconds * 1000));
    return 'OK';
  },

  async incr(key) {
    if (isRedisReady()) {
      try {
        return await redis.incr(key);
      } catch (e) {
        console.error('Redis incr failed, falling back:', e);
      }
    }
    // Fallback
    checkMemoryExpiry(key);
    const current = parseInt(memoryStore.get(key) || '0', 10);
    const next = current + 1;
    memoryStore.set(key, next.toString());
    return next;
  },

  async expire(key, seconds) {
    if (isRedisReady()) {
      try {
        return await redis.expire(key, seconds);
      } catch (e) {
        console.error('Redis expire failed, fallback:', e);
      }
    }
    // Fallback
    if (memoryStore.has(key)) {
      expiryStore.set(key, Date.now() + (seconds * 1000));
    }
    return 1;
  },

  async ping() {
    if (isRedisReady()) return 'PONG';
    return 'PONG (Memory)';
  }
};

// Pipeline abstraction
// Since ioredis pipeline is chainable, we can't easily replicate exact API without a Proxy.
// But for our app, we only use pipeline in `createPaste`.
// We can expose a specific `createPasteTransaction` or similar, OR mock a simple pipeline.

export const createPipeline = () => {
  if (isRedisReady()) {
    return redis.pipeline(); // Return real pipeline
  }

  // Validated: our app creates a pipeline, calls .set, .expire, .exec.
  // We can create a mock object.
  const ops = [];
  return {
    set(key, value) {
      ops.push(async () => store.set(key, value));
      return this;
    },
    expire(key, seconds) {
      ops.push(async () => store.expire(key, seconds));
      return this;
    },
    async exec() {
      // Execute sequentially
      for (const op of ops) {
        await op();
      }
      return ops.map(() => [null, 'OK']); // Mock response format of ioredis exec [[err, res], ...]
    }
  };
};
