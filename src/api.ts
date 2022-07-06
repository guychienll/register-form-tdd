export const register = async (values: any) => {
  const response = await fetch("https://localhost:3000/register", {
    method: "post",
    body: JSON.stringify(values),
  });
  return await response.json();
};
