import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react'
import { TransactionType } from '@/types'

interface TxBadgeProps {
  type: TransactionType
}

const config: Record<TransactionType, { label: string; icon: React.ReactNode; cls: string; amountCls: string; sign: string }> = {
  CREDIT: {
    label: 'Credit',
    icon: <ArrowDownLeft size={12} />,
    cls: 'bg-green-100 text-green-700',
    amountCls: 'text-green-600',
    sign: '+',
  },
  DEBIT: {
    label: 'Debit',
    icon: <ArrowUpRight size={12} />,
    cls: 'bg-red-100 text-red-700',
    amountCls: 'text-red-600',
    sign: '-',
  },
  TRANSFER_IN: {
    label: 'Transfer In',
    icon: <ArrowDownLeft size={12} />,
    cls: 'bg-blue-100 text-blue-700',
    amountCls: 'text-blue-600',
    sign: '+',
  },
  TRANSFER_OUT: {
    label: 'Transfer Out',
    icon: <ArrowLeftRight size={12} />,
    cls: 'bg-purple-100 text-purple-700',
    amountCls: 'text-purple-600',
    sign: '-',
  },
}

export function TxBadge({ type }: TxBadgeProps) {
  const c = config[type]
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.cls}`}>
      {c.icon}
      {c.label}
    </span>
  )
}

export function txAmountClass(type: TransactionType) {
  return config[type].amountCls
}

export function txSign(type: TransactionType) {
  return config[type].sign
}
