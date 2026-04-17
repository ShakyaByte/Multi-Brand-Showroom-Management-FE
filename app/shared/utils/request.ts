import axios from "axios";
import { store, Actions } from "../store";
import { toast } from "sonner";

export const APP_BASE_URL: string = process.env.NEXT_PUBLIC_APP_BASE_URL || '';

const http = axios.create({
  baseURL: `${APP_BASE_URL}/`,
  validateStatus: (status: number) => status >= 200 && status < 300,
  withCredentials: true,
});

// Response interceptor to handle token expiration (401 errors)
http.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login')) {
        // Redux state to reflect unauthenticated status
        store.dispatch(Actions.set("user", { isLoggedIn: false }));
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const storeProcess = async (config: any, data: any) => {
  const actionType: "set" | "append" | "update" | "remove" | "reset" = config.action;
  if (actionType !== "reset") {
    store.dispatch(Actions[actionType](config.key, data));
  } else {
    store.dispatch(Actions["reset"](config.key));
  }
};

const loadingProcess = async (config: any, loading = false) => {
  if (!!config?.store) {
    const actionType: "set" | "update" | "remove" | "reset" = config?.store?.action;
    if (actionType === "set" || actionType === "update") {
      const loadingData: any = {
        loading: loading,
        loadingState: true,
      };
      store.dispatch(Actions[actionType](config?.store?.key, loadingData));
    }
  }
};

const request = async (configuration: any) => {
  const { config, authorization, contentType, ...restConfiguration } = configuration;

  const defaultHeader: any = {};

  if (contentType === 'multipart/form-data') {
    // Don't set Content-Type for FormData
  } else if (restConfiguration.data instanceof FormData) {
    // Auto-detect FormData
  } else {
    defaultHeader["Content-Type"] = "application/json";
  }

  if (authorization) {
    const token = localStorage.getItem("token"); // Simplified for fresh start
    if (token) {
      defaultHeader.Authorization = `Bearer ${token}`;
    }
  }

  await loadingProcess(config, true);

  return await http({
    ...restConfiguration,
    url: restConfiguration?.url?.toString?.() || restConfiguration?.url,
    headers: { ...defaultHeader, ...restConfiguration.headers },
  })
    .then(async (res: any) => {
      if (res?.data?.errors) {
        throw new Error(
          res?.data?.errors?.[0]?.message || "Request failed"
        );
      }

      const data = res?.data?.data || res?.data;

      if (config?.store) {
        await storeProcess(config.store, data);
      }

      if (config?.successMsg) {
        toast.success(config.successMsg);
      }

      return data;
    })
    .catch(async (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Something went wrong";

      if (config?.showErr) {
        toast.error(message);
      }

      await loadingProcess(config, false);
      throw new Error(message);
    });
};

export default request;
