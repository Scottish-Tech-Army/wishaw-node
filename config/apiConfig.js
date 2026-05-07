// Backend API configuration
// When integrating with the Spring Boot backend, update these values

var DEFAULT_SESSION_SECRET = 'wishaw-ymca-dev-secret';
var sessionSecret = process.env.SESSION_SECRET || DEFAULT_SESSION_SECRET;
var useMock = process.env.USE_MOCK === 'true';
var baseUrl = process.env.API_BASE_URL || 'http://localhost:8080';
var isRemoteBaseUrl = !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(baseUrl);
var isProductionLike = process.env.NODE_ENV === 'production' || (process.env.NODE_ENV && process.env.NODE_ENV !== 'development' && !useMock) || isRemoteBaseUrl;

if (sessionSecret === DEFAULT_SESSION_SECRET) {
  if (isProductionLike) {
    throw new Error('SESSION_SECRET must be set before running in production-like mode.');
  }
  if (!useMock) {
    console.warn('WARNING: Using the default development SESSION_SECRET outside mock mode. Set SESSION_SECRET before shared or long-running use.');
  }
}

module.exports = {
  USE_MOCK: useMock,
  BASE_URL: baseUrl,
  API_PATH: '/api/v1',
  SESSION_SECRET: sessionSecret,
  SESSION_SECRET_IS_DEFAULT: sessionSecret === DEFAULT_SESSION_SECRET,
  IS_PRODUCTION_LIKE: isProductionLike,
  getApiUrl: function (path) {
    return this.BASE_URL + this.API_PATH + path;
  }
};
