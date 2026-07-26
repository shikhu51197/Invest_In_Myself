'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PopupModal from './PopupModal';

export default function AdminControls({ postId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: 'alert', variant: 'info', title: '', message: '' });

  const handleDeleteClick = () => {
    setModal({
      isOpen: true,
      type: 'confirm',
      variant: 'danger',
      title: 'Confirm Deletion 🗑️',
      message: 'Are you completely sure you want to permanently delete this creation? This action cannot be undone.',
      confirmText: 'Yes, Proceed',
      cancelText: 'Cancel',
      onConfirm: () => promptPassword(),
      onClose: () => setModal(prev => ({ ...prev, isOpen: false }))
    });
  };

  const promptPassword = () => {
    const savedSecret = sessionStorage.getItem('emowords-admin-secret');
    if (savedSecret) {
      executeDelete(savedSecret);
      return;
    }

    setModal({
      isOpen: true,
      type: 'prompt',
      variant: 'secure',
      isPassword: true,
      title: 'Admin Authorization Required 🔐',
      message: 'Please enter your Admin Password to verify deletion rights.',
      placeholder: 'Enter Admin Password...',
      confirmText: 'Authorize & Delete',
      onConfirm: (secret) => {
        if (!secret) return;
        sessionStorage.setItem('emowords-admin-secret', secret);
        executeDelete(secret);
      },
      onClose: () => setModal(prev => ({ ...prev, isOpen: false }))
    });
  };

  const executeDelete = async (secret) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': secret
        }
      });

      if (res.ok) {
        setModal({
          isOpen: true,
          type: 'alert',
          variant: 'success',
          title: 'Deleted Successfully! 🗑️',
          message: 'The post has been removed from the EmoWords universe.',
          confirmText: 'Return to Hub',
          onConfirm: () => {
            router.refresh();
            if (window.location.pathname.includes(`/post/${postId}`)) {
              router.push('/');
            }
          },
          onClose: () => {
            router.refresh();
            if (window.location.pathname.includes(`/post/${postId}`)) {
              router.push('/');
            }
          }
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          sessionStorage.removeItem('emowords-admin-secret');
          setModal({
            isOpen: true,
            type: 'alert',
            variant: 'error',
            title: 'Authorization Failed ❌',
            message: 'Incorrect Admin Password! Deletion permission denied.',
            onClose: () => setModal(prev => ({ ...prev, isOpen: false }))
          });
        } else {
          setModal({
            isOpen: true,
            type: 'alert',
            variant: 'error',
            title: 'Delete Error ❌',
            message: errorData.error || 'Failed to delete post.',
            onClose: () => setModal(prev => ({ ...prev, isOpen: false }))
          });
        }
      }
    } catch (err) {
      console.error(err);
      setModal({
        isOpen: true,
        type: 'alert',
        variant: 'error',
        title: 'Network Error ❌',
        message: 'An unexpected network error occurred while deleting.',
        onClose: () => setModal(prev => ({ ...prev, isOpen: false }))
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Link href={`/edit/${postId}`} prefetch={false} className="btn-outline" style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>
        Edit
      </Link>
      <button 
        onClick={handleDeleteClick} 
        disabled={isDeleting}
        className="btn-outline" 
        style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', color: '#ef4444', borderColor: '#ef4444', cursor: 'pointer' }}
      >
        {isDeleting ? '...' : 'Delete'}
      </button>

      <PopupModal
        isOpen={modal.isOpen}
        onClose={modal.onClose || (() => setModal(prev => ({ ...prev, isOpen: false })))}
        type={modal.type}
        variant={modal.variant}
        title={modal.title}
        message={modal.message}
        placeholder={modal.placeholder}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        isPassword={modal.isPassword}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
}
