import api from "@/api/api"; // 路徑看你放哪裡
// or 相對路徑 import api from "../api"

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
  await api.post("/transaction", params);
}

async function editTransaction(id: number, params: Transaction) {
  await api.put(`/transaction/${id}`, params);
}

async function deleteTransaction(id: number) {
  await api.delete(`/transaction/${id}`);
}

async function getTransactionList(params: TransactionFilter | {}) {
  const res = await api.post("/transaction/list", params);
  return res;
}

export {
  getTransactionList,
  addTransaction,
  editTransaction,
  deleteTransaction,
};
