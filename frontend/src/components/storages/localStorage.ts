export const setUserInLocalStorage = (name: string) => {
  localStorage.setItem("user", name);
};

export const getUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem("user") ?? "";
  return storedUser;
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
