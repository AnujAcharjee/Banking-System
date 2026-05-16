/**
 * utils.ts — safe barrel re-export. No server-only code here.
 * For server-only helpers import from '@/lib/server-utils'.
 */
export {
  formatCurrency,
  formatDate,
  formatDateShort,
  generateTransactionRef,
  generateOTP,
  generateAccountNumber,
  cn,
} from './client-utils'
