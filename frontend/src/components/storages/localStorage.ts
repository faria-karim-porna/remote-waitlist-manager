export const setUserInSessionStorage = (name: string) => {
  sessionStorage.setItem("user", name);
};

export const getUserFromSessionStorage = () => {
  const storedUser = sessionStorage.getItem("user") ?? "";
  return storedUser;
};

export const clearSessionStorage = () => {
  sessionStorage.clear();
};
