import api from "@/api/api";

interface Transaction {
  date: string;
  note: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
}

interface TransactionFilter {
  startDate: string | null;
  endDate: string | null;
  minAmount: number | null;
  maxAmount: number | null;
  type: "INCOME" | "EXPENSE" | null;
  category: string[] | null;
}

async function addTransaction(params: Transaction) {
  const res = await api.post("/transaction", params);
  return res;
}

async function editTransaction(id: number, params: Transaction) {
  const res = await api.put(`/transaction/${id}`, params);
  return res;
}

async function deleteTransaction(id: number) {
  await api.delete(`/transaction/${id}`);
}

async function getTransactionList(params: TransactionFilter | {}) {
  const res = await api.post("/transaction/list", params);
  return res;
}

async function getTransactionChart() {
  const res = await api.get("/transaction/six-months-summary");
  return res;
}

export {
  getTransactionList,
  addTransaction,
  editTransaction,
  deleteTransaction,
  getTransactionChart,
};
