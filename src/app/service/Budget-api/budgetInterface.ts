export interface Transaction {
  // 1. Unique ID (Database se milegi ya Date.now() use karenge)
  id: number | string;
  // 2. Transaction ka naam (e.g., "Biryani Treat", "Office Salary", "Internet Bill")
  title: string;
  // 3. Amount (Hamesha Number me hoga taake calculation ho sake)
  amount: number;
  // 4. Transaction ki type (Yahan hum constraint laga rahe hain ke bas yehi do values hon)
  type: 'income' | 'expense';
  // 5. Date (Date object ya ISO string string form me rakh sakte hain)
  date: string;
}
