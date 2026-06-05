import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  signal,
} from '@angular/core';
import { NavigationBar } from '../../navigation-bar/navigation-bar';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BudgetApi } from '../../../service/Budget-api/budget-api';
import { Transaction } from '../../../service/Budget-api/budgetInterface';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [NavigationBar, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  constructor(
    private transactionService: BudgetApi,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router,
  ) {}

  allTransactions = signal<Transaction[]>([]);
  edit = false;
  currentEditingId: string | number | null = null;
  income = signal<number>(0);
  expense = signal<number>(0);
  balance = signal<number>(0);

  editTransaction = new FormGroup({
    title: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.min(0)]),
    type: new FormControl('', [Validators.required]),
    category: new FormControl(''),
    date: new FormControl('', [Validators.required]),
  });

  // ─── LOAD TRANSACTIONS ───────────────────────────────────────
  loadTransactions() {
    if (typeof window === 'undefined') return;

    const localStorageData = localStorage.getItem('user');
    const userId = localStorageData ? JSON.parse(localStorageData).id : null;

    if (!userId) return;

    this.transactionService.getTransactions(userId).subscribe({
      next: (data) => {
        this.allTransactions.set([...data]);
        this.calculateSummary();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Load error:', err),
    });
  }
calculateSummary() {
  const transactions = this.allTransactions();
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  this.income.set(totalIncome);
  this.expense.set(totalExpense);
  this.balance.set(totalIncome - totalExpense);
}

  ngOnInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.loadTransactions();
    });

    this.loadTransactions();
  }

  // ─── DELETE ──────────────────────────────────────────────────
  deleteBudget(id: string | number) {
    this.transactionService.deleteTransaction(id).subscribe({
      next: () => {
        this.allTransactions.set(this.allTransactions().filter((t) => String(t.id) !== String(id)));
        this.calculateSummary();
        this.cdr.detectChanges();
      },
    });
  }

  // ─── EDIT (form mein data fill karo) ─────────────────────────
  editBudget(id: string | number) {
    const found = this.allTransactions().find((t) => t.id === id);
    if (found) {
      this.currentEditingId = id;
      this.editTransaction.patchValue({
        title: found.title,
        amount: found.amount.toString(),
        type: found.type,
        date: found.date.split('T')[0],
      });
      this.edit = true;
      this.cdr.markForCheck();
    }
  }

  // ─── ADD / UPDATE ─────────────────────────────────────────────
  addBudget() {
    if (typeof window === 'undefined') return;
    if (this.editTransaction.invalid) return;

    const formData = this.editTransaction.value;

    // UPDATE
    if (this.edit && this.currentEditingId) {
      this.transactionService.editTransaction(this.currentEditingId, formData).subscribe({
        next: () => {
          this.allTransactions.set(
            this.allTransactions().map((t: any) => {
              if (t.id === this.currentEditingId) {
                return {
                  ...t,
                  title: formData.title ?? t.title,
                  amount: formData.amount ?? t.amount,
                  type: formData.type ?? t.type,
                  date: formData.date ?? t.date,
                };
              }
              return t;
            }),
          );
          this.calculateSummary();
          this.edit = false;
          this.currentEditingId = null;
          this.editTransaction.reset();
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Update error:', err),
      });
      // ADD
    } else {
      const localStorageData = localStorage.getItem('user');
      const userId = localStorageData ? JSON.parse(localStorageData).id : null;

      const savingdata = { ...formData, user_id: userId };

      this.transactionService.addTransaction(savingdata).subscribe({
        next: (res: any) => {
          this.allTransactions.set([res.transaction, ...this.allTransactions()]);
          this.calculateSummary();
          this.editTransaction.reset();
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Add error:', err),
      });
    }
  }

  openIncomeEditModal() {}
}
