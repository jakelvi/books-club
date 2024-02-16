import axios from "axios";

export async function login(username, password) {
  try {
    const response = await axios.post(
      "http://localhost:5050/api/v1/users/login",
      {
        username,
        password,
      }
    );
    return response.data;
  } catch (error) {
    return { error: "Invalid username or password." };
  }
}

export async function getUser(username) {
  try {
    const { data } = await axios.get(
      "http://localhost:5050/api/v1/users/user",
      username
    );
    return { data };
  } catch (error) {
    return { error: "Failed to fetch user data." };
  }
}

export async function register(credentials) {
  try {
    const { data } = await axios.post(
      "http://localhost:5050/api/v1/users/register",
      credentials
    );
    return data;
  } catch (error) {
    return { error: "Failed to register user." };
  }
}

export async function updateUser(response) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token available");
    const { data } = await axios.put(
      "http://localhost:5050/api/v1/users/updateuser",
      response,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (error) {
    return { error: "Failed to update the user." };
  }
}
