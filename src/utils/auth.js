export const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const isLoggedIn = () => Boolean(getStoredUser());

export const requestLogin = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("open-login-modal"));
};

export const requireLogin = () => {
  if (isLoggedIn()) return true;
  requestLogin();
  return false;
};
