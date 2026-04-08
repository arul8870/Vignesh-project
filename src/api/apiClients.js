import axios from "axios";
import {
  BACKEND_SERVER_URL,
  API_WHITELIST_URLS,
  AUTH_REQUIRED_MSG,
  INSUFFICIENT_PERM_MSG,
  UNSUPPORTED_HTTP_METHOD_MSG,
  HTTP_METHODS,
  UNDEFINED,
  BLOB,
  CONTENT_TYPE,
  API_NOT_FOUND,
  NETWORK_ERROR,
} from "../utils/constants";
import { ReduxStorageManager } from "../store/reduxStorageManager";
import { mockStorage } from "./mockStorage";

// Initialize mock storage
mockStorage.init();

// Create axios instance with base configuration
const apiInstance = axios.create({
  baseURL: BACKEND_SERVER_URL,
});

// Add request interceptor to handle authentication
apiInstance.interceptors.request.use(
  (config) => {
    // Get token from storage manager
    const token = ReduxStorageManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common error cases
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error cases
    if (!error.response) {
      // Network error
      return Promise.reject(new Error(NETWORK_ERROR));
    }
    return Promise.reject(error);
  }
);

// Helper function to check if the payload is a FormData object
function isFormData(data) {
  // We check for FormData in the global scope to ensure compatibility
  return typeof FormData !== UNDEFINED && data instanceof FormData;
}

class ApiClient {
  constructor() {
    this.client = apiInstance;
    // some changes
  }

  async get(endpoint, config = {}) {
    const res = await this.client.get(endpoint, config);
    return res.data;
  }

  async getBlob(endpoint, config = {}) {
    const res = await this.client.get(endpoint, {
      ...config,
      responseType: BLOB,
    });
    return res;
  }

  // Modify the post method to handle FormData headers
  async post(endpoint, data, config = {}) {
    let finalConfig = config;

    if (isFormData(data)) {
      // IMPORTANT: Copy the config to avoid mutation side effects
      finalConfig = { ...config };

      // 1. Ensure headers object exists
      finalConfig.headers = {
        ...finalConfig.headers,
      };

      // 2. Set Content-Type to undefined. This is the TRICK to force the browser
      //    to correctly set the 'multipart/form-data; boundary=...' header.
      finalConfig.headers[CONTENT_TYPE] = undefined;
    }

    const res = await this.client.post(endpoint, data, finalConfig);
    return res.data;
  }

  async put(endpoint, data, config = {}) {
    const res = await this.client.put(endpoint, data, config);
    return res.data;
  }

  async delete(endpoint, config = {}) {
    const res = await this.client.delete(endpoint, config);
    return res.data;
  }

  apiCall = async (identity, url, method, data = null) => {
    // Intercept all auth and data calls for local-only architecture
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate minor delay

    if (url.includes("/auth/login")) {
      return mockStorage.login(data.username, data.password);
    }

    // Generic handler for mock data
    if (url.includes("/updates")) {
      if (method === HTTP_METHODS.GET) return { success: true, data: mockStorage.get("UPDATES") };
      if (method === HTTP_METHODS.POST) return { success: true, data: mockStorage.add("UPDATES", data) };
      if (method === HTTP_METHODS.PUT || method === HTTP_METHODS.PATCH) {
        return { success: true, data: mockStorage.update("UPDATES", data.id, data.updates) };
      }
      if (method === HTTP_METHODS.DELETE) {
        mockStorage.delete("UPDATES", data?.id);
        return { success: true, message: "Update deleted successfully" };
      }
    }

    if (url.includes("/announcements")) {
      if (method === HTTP_METHODS.GET) return { success: true, data: mockStorage.get("ANNOUNCEMENTS") };
      if (method === HTTP_METHODS.POST) return { success: true, data: mockStorage.add("ANNOUNCEMENTS", data) };
      if (method === HTTP_METHODS.PUT || method === HTTP_METHODS.PATCH) {
        return { success: true, data: mockStorage.update("ANNOUNCEMENTS", data.id, data.updates) };
      }
      if (method === HTTP_METHODS.DELETE) {
        mockStorage.delete("ANNOUNCEMENTS", data?.id);
        return { success: true, message: "Announcement deleted successfully" };
      }
    }

    if (url.includes("/applications")) {
      if (method === HTTP_METHODS.GET) return { success: true, data: mockStorage.get("APPLICATIONS") };
      if (method === HTTP_METHODS.POST) return { success: true, data: mockStorage.add("APPLICATIONS", data) };
      if (method === HTTP_METHODS.PUT || method === HTTP_METHODS.PATCH) {
        return { success: true, data: mockStorage.update("APPLICATIONS", data.id, data.updates) };
      }
      if (method === HTTP_METHODS.DELETE) {
        mockStorage.delete("APPLICATIONS", data?.id);
        return { success: true, message: "Application deleted successfully" };
      }
    }

    if (url.includes("/jobs")) {
      if (method === HTTP_METHODS.GET) return { success: true, data: mockStorage.get("JOBS") };
      if (method === HTTP_METHODS.POST) return { success: true, data: mockStorage.add("JOBS", data) };
      if (method === HTTP_METHODS.PUT || method === HTTP_METHODS.PATCH) {
        return { success: true, data: mockStorage.update("JOBS", data.id, data.updates) };
      }
      if (method === HTTP_METHODS.DELETE) {
        mockStorage.delete("JOBS", data?.id);
        return { success: true, message: "Job deleted successfully" };
      }
    }

    if (url.includes("/students")) {
      return { success: true, data: mockStorage.get("STUDENTS") };
    }

    if (url.includes("/users/active")) {
      return { success: true, data: mockStorage.get("USERS") };
    }

    if (url.includes("/users/logout")) {
      return { success: true, message: "Logged out locally" };
    }

    try {
      let response;
      switch (method) {
        case HTTP_METHODS.GET:
          response = await this.get(url);
          break;
        case HTTP_METHODS.POST:
          console.log("post: ", data);
          response = await this.post(url, data);
          break;
        case HTTP_METHODS.PUT:
          response = await this.put(url, data);
          break;
        case HTTP_METHODS.DELETE:
          response = await this.delete(url);
          break;
        default:
          console.log(`${UNSUPPORTED_HTTP_METHOD_MSG} ${method}`);
          return {
            success: false,
            message: `${UNSUPPORTED_HTTP_METHOD_MSG} ${method}`,
          };
      }

      if (response) {
        return response;
      } else {
        console.log(`${UNSUPPORTED_HTTP_METHOD_MSG} ${method}`);
        return {
          success: false,
          message: `${UNSUPPORTED_HTTP_METHOD_MSG} ${method}`,
        };
      }
    } catch (error) {
      // Return standardized error shape
      console.log(`${identity}:`, error);
      let message = error.message || NETWORK_ERROR;
      if (error.response) {
        if (error.response.status === 404) {
          message = API_NOT_FOUND;
        } else if (error.response.status === 401) {
          message = AUTH_REQUIRED_MSG;
        } else if (error.response.status === 403) {
          message = INSUFFICIENT_PERM_MSG;
        } else if (error.response.data && error.response.data.message) {
          message = error.response.data.message;
        }
      }
      return { success: false, message: message };
    }
  };
}

export const apiClient = new ApiClient();