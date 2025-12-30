export function getNow(requestOrHeaders) {
  // Check for TEST_MODE environment variable
  const isTestMode = process.env.TEST_MODE === '1';

  if (isTestMode && requestOrHeaders) {
    // Handle both Request object (has .headers) or direct Headers object
    const headers = requestOrHeaders.headers || requestOrHeaders;
    
    if (typeof headers.get === 'function') {
      const testNowHeader = headers.get('x-test-now-ms');
      if (testNowHeader) {
        const parsed = parseInt(testNowHeader, 10);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
    }
  }

  return Date.now();
}
