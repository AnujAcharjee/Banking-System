'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function DeleteUserButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you ABSOLUTELY sure you want to delete this user? This will permanently erase their account and all transaction history. This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        toast.error(data.error || 'Failed to delete user')
      } else {
        toast.success('User and all associated data permanently deleted.')
        router.push('/admin/users')
        router.refresh()
      }
    } catch (err) {
      toast.error('Network error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors rounded-xl font-medium text-sm disabled:opacity-50"
    >
      <Trash2 size={16} />
      {loading ? 'Deleting...' : 'Delete User Account'}
    </button>
  )
}
