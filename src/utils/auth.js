// utils/auth.js

export const isAuthenticated = () => {
  return localStorage.getItem("loggedIn") === "true";
};

export const loginUser = () => {
  localStorage.setItem("loggedIn", "true");
};

export const logoutUser = () => {
  localStorage.removeItem("loggedIn");
};


