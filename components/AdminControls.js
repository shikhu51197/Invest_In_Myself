'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminControls({ postId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const secret = prompt('Enter Admin Password to Delete:');
    if (!secret) return;

    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': secret
        }
      });

      if (res.ok) {
        alert('Post deleted successfully!');
        router.refresh(); // Refresh the page to remove the deleted post
        // If we are on the post detail page, redirect to home
        if (window.location.pathname.includes(`/post/${postId}`)) {
          router.push('/');
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'Failed to delete post.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Link href={`/edit/${postId}`} className="btn-outline" style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>
        Edit
      </Link>
      <button 
        onClick={handleDelete} 
        disabled={isDeleting}
        className="btn-outline" 
        style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', color: '#ef4444', borderColor: '#ef4444' }}
      >
        {isDeleting ? '...' : 'Delete'}
      </button>
    </div>
  );
}
