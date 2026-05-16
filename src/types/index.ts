export interface User {
  id: string
  accountNumber: string
  fullName: string
  email?: string | null
  phone: string
  address: string
  panNumber: string
  aadhaarNumber: string
  createdAt: string
  account: {
    balance: number
    isActive: boolean
  }
}

export type TransactionType = 'CREDIT' | 'DEBIT' | 'TRANSFER_IN' | 'TRANSFER_OUT'
export type TxStatus = 'SUCCESS' | 'FAILED' | 'PENDING'

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  balanceAfter: number
  description?: string | null
  referenceNumber: string
  status: TxStatus
  createdAt: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
