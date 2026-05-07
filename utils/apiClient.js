/**
 * API Client utility
 * Central wrapper for all HTTP calls to the Spring Boot backend.
 * When USE_MOCK is false, all service calls route through here.
 *
 * To switch to real backend:
 *   Set USE_MOCK = false in config/apiConfig.js
 *   Ensure Spring Boot is running on BASE_URL
 *
 * Auth: uses JSESSIONID cookie forwarding. The backend sets JSESSIONID on
 * POST /api/v1/auth/login; subsequent requests forward it via Cookie header.
 * If the backend returns a new Set-Cookie, session.backendCookie is updated.
 */
var http = require('http');
var https = require('https');
var apiConfig = require('../config/apiConfig');

function storeBackendCookie(setCookieHeader, session) {
  if (!setCookieHeader || !session) {
    return;
  }

  var cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  cookies.forEach(function (cookie) {
    if (cookie.toUpperCase().indexOf('JSESSIONID=') === 0 ||
        cookie.toUpperCase().indexOf('JSESSIONID=') > -1 &&
        cookie.toUpperCase().split('JSESSIONID=').length > 1) {
      var match = cookie.match(/JSESSIONID=([^;]+)/i);
      if (match) session.backendCookie = 'JSESSIONID=' + match[1];
    }
  });
}

/**
 * Make an HTTP request to the backend API.
 * @param {string} method   - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {string} path     - API path (e.g. '/players')
 * @param {object} [body]   - Request body for POST/PUT/PATCH
 * @param {object} [session] - Express session object (session.backendCookie holds JSESSIONID)
 * @returns {Promise<any>}
 */
function request(method, path, body, session, options) {
  return new Promise(function (resolve, reject) {
    options = options || {};
    var url = new URL(apiConfig.getApiUrl(path));
    var isHttps = url.protocol === 'https:';
    var lib = isHttps ? https : http;
    var hasRawBody = Object.prototype.hasOwnProperty.call(options, 'rawBody');
    var requestBody = hasRawBody ? options.rawBody : (body ? JSON.stringify(body) : '');
    var headers = Object.assign({ 'Accept': 'application/json' }, options.headers || {});

    if (!hasRawBody && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    if (requestBody && requestBody.length) headers['Content-Length'] = Buffer.byteLength(requestBody);

    // Forward the backend JSESSIONID cookie so Spring Security recognises the session
    if (session && session.backendCookie) {
      headers['Cookie'] = session.backendCookie;
    }

    var options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: headers
    };

    var req = lib.request(options, function (res) {
      storeBackendCookie(res.headers['set-cookie'], session);

      var data = '';
      res.on('data', function (chunk) { data += chunk; });
      res.on('end', function () {
        try {
          var parsed = data ? JSON.parse(data) : null;
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject({ status: res.statusCode, body: parsed });
          }
        } catch (e) {
          reject({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', function (e) { reject({ status: 0, body: e.message }); });
    if (requestBody && requestBody.length) req.write(requestBody);
    req.end();
  });
}

module.exports = {
  get: function (path, session) { return request('GET', path, null, session); },
  post: function (path, body, session) { return request('POST', path, body, session); },
  put: function (path, body, session) { return request('PUT', path, body, session); },
  patch: function (path, body, session) { return request('PATCH', path, body, session); },
  del: function (path, session) { return request('DELETE', path, null, session); },
  postMultipart: async function (path, fields, file, session) {
    var url = apiConfig.getApiUrl(path);
    var headers = { 'Accept': 'application/json' };
    var formData = new FormData();

    Object.keys(fields || {}).forEach(function (fieldName) {
      formData.append(fieldName, fields[fieldName] == null ? '' : String(fields[fieldName]));
    });

    formData.append(
      file.fieldName,
      new Blob([file.buffer], { type: file.contentType || 'application/octet-stream' }),
      file.filename || 'upload.bin'
    );

    if (session && session.backendCookie) {
      headers['Cookie'] = session.backendCookie;
    }

    var response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData
    });

    var setCookieHeader = response.headers.getSetCookie ? response.headers.getSetCookie() : response.headers.get('set-cookie');
    storeBackendCookie(setCookieHeader, session);

    var text = await response.text();
    var parsed = null;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch (_) {
        parsed = text;
      }
    }

    if (response.ok) {
      return parsed;
    }

    throw { status: response.status, body: parsed };
  }
};
