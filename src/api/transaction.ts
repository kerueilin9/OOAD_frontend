import axios from "axios";

interface Transaction {
  date: string;
  note: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
}

async function getTransactionList() {
  let token = localStorage.getItem("token");
  // token = import.meta.env.VITE_TOKEN;
  const res = await axios.post(
    "http://localhost:8080/transaction/list",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
}

async function addTransaction(params: Transaction) {
  let token = localStorage.getItem("token");
  // token = import.meta.env.VITE_TOKEN;
  console.log(token);
  await axios.post("http://localhost:8080/transaction", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function editTransaction(id: number, params: Transaction) {
  let token = localStorage.getItem("token");
  // token = import.meta.env.VITE_TOKEN;
  console.log(token);
  await axios.put(`http://localhost:8080/transaction/${id}`, params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function deleteTransaction(id: number) {
  let token = localStorage.getItem("token");
  // token = import.meta.env.VITE_TOKEN;
  console.log(token);
  await axios.delete(`http://localhost:8080/transaction/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export {
  getTransactionList,
  addTransaction,
  editTransaction,
  deleteTransaction,
};
