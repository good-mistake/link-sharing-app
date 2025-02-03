const API_BASE_URL = "/api/profile";

export const getProfile = async (userId) => {
  const response = await fetch(`${API_BASE_URL}?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch profile");
  return await response.json();
};

export const updateProfile = async (userId, linkData) => {
  const response = await fetch(`${API_BASE_URL}?userId=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(linkData),
  });
  if (!response.ok) throw new Error("ّFailed to add link");
  return await response.json();
};

export const addLink = async (userId, linkData) => {
  const response = await fetch(`${API_BASE_URL}?userId=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(linkData),
  });
  if (!response.ok) throw new Error("Failed to add link");
  return await response.json();
};

export const deleteLink = async (userId, linkId) => {
  const response = await fetch(`${API_BASE_URL}?userId=${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ linkId }),
  });
  if (!response.ok) throw new Error("Failed to delete link");
  return await response.json();
};
export const deleteProfile = async (userId) => {
  const response = await fetch(`${API_BASE_URL}?userId=${userId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete profile");
  return await response.json();
};
