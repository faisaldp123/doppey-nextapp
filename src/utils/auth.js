export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};