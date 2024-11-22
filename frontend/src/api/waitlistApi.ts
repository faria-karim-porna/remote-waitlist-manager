type Party = {
  _id: string;
  name: string;
  size: number;
};

export const joinWaitlist = async (name: string, size: number): Promise<Party> => {
  const response = await fetch("http://localhost:5000/waitlist/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, size }),
  });

  if (!response.ok) {
    throw new Error("Failed to join waitlist");
  }

  return await response.json(); // Returns party data with unique ID
};
