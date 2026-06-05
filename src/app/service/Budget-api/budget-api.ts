import { Injectable } from '@angular/core';
import { Transaction } from './budgetInterface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BudgetApi {
  constructor(private http: HttpClient) {}
  url = 'https://budget-backend-rmb9.onrender.com/transactions';

  // Yahan par aap API calls ke methods bana sakte hain, jaise:
  // getTransactions(), addTransaction(transaction: Transaction), deleteTransaction(id: number | string), etc.
getTransactions(userId: number | string) {
  return this.http.get<Transaction[]>(`${this.url}/user/${userId}`);
}
  deleteTransaction(id: number | string) {
    return this.http.delete(`${this.url}/${id}`);
  }
  editTransaction(id: number | string, updatedTransaction: any) {
    return this.http.put(`${this.url}/${id}`, updatedTransaction);
  }
addTransaction(data: any) {
  return this.http.post(`${this.url}`, data);
}
// getTransactionsByUser(userId: number | string) {
//   return this.http.get<Transaction[]>(`${this.url}/user/${userId}`);
// }
}
