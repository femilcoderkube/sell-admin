import axios from "axios";
import { logout } from "./app/features/auth/authSlice";
import { generateToken } from "./utils/SecurityService";
import cryptoUtils from "./utils/cryptoUtils";

export const baseURL = import.meta.env.VITE_API_BASE_URL;
const secret = import.meta.env.VITE_SECRET_KEY;
const encryptionEnabled = import.meta.env.VITE_ENCRYPTION_STATUS;

const axiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
    ...(encryptionEnabled && { "X-Encrypt-Response": "true" }),
  },
});

let reduxStore: any = null;
export const setAxiosStore = (storeInstance: any) => {
  reduxStore = storeInstance;
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    const payload = { data: "SecurityPayload", time: Date.now() };

    if (secret) {
      let secrets = await generateToken(secret, payload);
      config.headers["X-Auth-Token"] = secrets;
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const lang = localStorage.getItem("lang") || "en";
    config.headers["Accept-Language"] = lang;

    // const contentTypeHeader =
    //   typeof config.headers["Content-Type"] === "string"
    //     ? config.headers["Content-Type"]
    //     : undefined;

    // if (config.data && cryptoUtils.shouldEncrypt(config.data, contentTypeHeader)) {
    //   try {
    //     const encryptedData = cryptoUtils.encrypt(config.data);
    //     config.data = { encryptedData };
    //     config.headers["X-Encrypted"] = "true";
    //     config.headers["X-Encryption-Method"] = "AES-256-CBC";
    //   } catch (error) {
    //     console.error("Failed to encrypt request data:", error);
    //   }
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isLoggingOut = false;

axiosInstance.interceptors.response.use(
  (response) => {
    if (encryptionEnabled && response.data?.encryptedData) {
      try {
        const decryptedData = cryptoUtils.decrypt(response.data.encryptedData);
        response.data = decryptedData;
      } catch (error) {
        console.error("Failed to decrypt response data:", error);
        console.error("Encrypted data was:", response.data.encryptedData);
      }
    } else {
      console.warn("Response marked as encrypted but no encryptedData found");
      console.log("Response data structure:", Object.keys(response.data || {}));
    }
    return response;
  },
  (error) => {
    if (encryptionEnabled) {
      const isEncrypted =
        error.response?.headers["x-encrypted"] === "true" ||
        error.response?.headers["X-Encrypted"] === "true";

      if (isEncrypted && error.response?.data?.encryptedData) {
        try {
          const decryptedError = cryptoUtils.decrypt(
            error.response.data.encryptedData
          );
          error.response.data = decryptedError;
        } catch (decryptError) {
          console.error("Failed to decrypt error response:", decryptError);
          console.error(
            "Encrypted error data was:",
            error.response.data.encryptedData
          );
        }
      } else if (isEncrypted) {
        console.warn(
          "Error response marked as encrypted but no encryptedData found"
        );
      }
    }

    if (error.response && error.response.status === 401) {
      if (!isLoggingOut) {
        isLoggingOut = true;
        if (reduxStore) {
          reduxStore.dispatch(logout());
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
