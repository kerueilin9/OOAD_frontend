import axios from "axios";

async function login(params: object) {
  const res = await axios.post("http://localhost:8080/auth/login", params);
  return res;
}

export { login };
