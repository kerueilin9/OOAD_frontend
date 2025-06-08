import api from "@/api/api";

async function getAIAdvice(params: object) {
  const res = await api.post("/ai/generate", params);
  return res;
}

export { getAIAdvice };
