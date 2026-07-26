'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { compressImageIfNeeded } from '@/utils/imageOptimizer';
import PopupModal from '@/components/PopupModal';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

const CATEGORIES = ['Poetry', 'Shayri', 'Songs', 'Sketches', 'Recipes', 'Blogs', 'Thoughts', 'Advice'];

export default function EditPost({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const postId = resolvedParams.id;

  const [formData, setFormData] = useState({
    title: '',
    category: 'Thoughts',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authHeader, setAuthHeader] = useState('');
  const [fileUploading, setFileUploading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: 'alert', variant: 'info', title: '', message: '' });

  const showAlert = (title, message, variant = 'error', onClose = null, type = 'alert') => {
    setModal({
      isOpen: true,
      type,
      variant,
      title,
      message,
      onClose: onClose || (() => setModal(prev => ({ ...prev, isOpen: false }))),
      onConfirm: onClose || (() => setModal(prev => ({ ...prev, isOpen: false })))
    });
  };

  const handleFileChange = async (e) => {
    const rawFiles = Array.from(e.target.files || []);
    if (!rawFiles.length) return;

    setFileUploading(true);
    const files = [];

    // Automagically compress and optimize large photos/PNGs in the browser before upload check
    for (const file of rawFiles) {
      if (file.type?.startsWith('image/') || file.name.match(/\.(png|jpg|jpeg|webp|tiff|bmp)$/i)) {
        try {
          const optimized = await compressImageIfNeeded(file);
          files.push(optimized);
        } catch (_) {
          files.push(file);
        }
      } else {
        files.push(file);
      }
    }

    // Vercel serverless has an infrastructure HTTP request body limit of ~4.5 MB.
    for (const file of files) {
      if (file.size > 4.2 * 1024 * 1024 && window.location.hostname.includes('vercel.app')) {
        showAlert('File Too Large 📦', `"${file.name}" exceeds Vercel's 4.5 MB serverless HTTP upload limit. Please attach smaller files or configure Cloud Blob storage.`, 'warning');
        if (e.target) e.target.value = '';
        setFileUploading(false);
        return;
      }
    }
    
    let mediaType = 'image';
    const firstFile = files[0];
    if ((firstFile.type && firstFile.type.startsWith('video/')) || firstFile.name.match(/\.(mp4|mov|webm|avi|mkv)$/i)) mediaType = 'video';
    else if ((firstFile.type && firstFile.type.startsWith('audio/')) || firstFile.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) mediaType = 'audio';
    else if (!firstFile.type?.startsWith('image/')) mediaType = 'document';

    try {
      const uploadData = new FormData();
      for (const file of files) {
        uploadData.append('files', file);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      });

      const responseText = await res.text();

      if (!res.ok) {
        if (res.status === 413 || responseText.includes('Request Entity Too Large') || responseText.includes('Content Too Large')) {
          throw new Error('File size exceeded server upload allowance (HTTP 413: Content Too Large). On Vercel deployments, uploads via HTTP POST are strictly capped at 4.5 MB.');
        }
        let errorMessage = `Server error (Status ${res.status})`;
        try {
          const errJson = JSON.parse(responseText);
          if (errJson.error) errorMessage = errJson.error;
        } catch (_) {}
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);
      if (data.success && (data.mediaList || data.url)) {
        const newItems = data.mediaList || [{ url: data.url, type: mediaType, name: firstFile.name }];
        setFormData(prev => {
          const updatedList = [...(prev.mediaList || []), ...newItems];
          return {
            ...prev,
            mediaList: updatedList,
            mediaUrl: updatedList[0]?.url || null,
            mediaType: updatedList[0]?.type || null
          };
        });
      } else {
        showAlert('Upload Failed ❌', data.error || 'Failed to upload media files.', 'error');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      showAlert('Upload Error ❌', err.message || 'A network error occurred while uploading media.', 'error');
    } finally {
      setFileUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const removeMediaItem = (indexToRemove) => {
    setFormData(prev => {
      const updatedList = (prev.mediaList || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        mediaList: updatedList,
        mediaUrl: updatedList.length > 0 ? updatedList[0].url : '',
        mediaType: updatedList.length > 0 ? updatedList[0].type : ''
      };
    });
  };

  const fetchPostData = (secret) => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(posts => {
        const post = posts.find(p => p.id === postId);
        if (post) {
          setFormData({
            title: post.title || '',
            category: post.category || 'Thoughts',
            content: post.content || '',
            mediaUrl: post.mediaUrl || '',
            mediaType: post.mediaType || '',
            mediaList: post.mediaList || (post.mediaUrl ? [{ url: post.mediaUrl, type: post.mediaType || 'image', name: post.title || 'Attached Media' }] : [])
          });
          setLoading(false);
        } else {
          showAlert('Not Found 🔍', 'The requested post could not be found.', 'error', () => router.push('/'));
        }
      })
      .catch(err => {
        console.error(err);
        showAlert('Fetch Error ❌', 'Failed to fetch existing post data.', 'error', () => router.push('/'));
      });
  };

  useEffect(() => {
    const savedSecret = sessionStorage.getItem('emowords-admin-secret');
    if (!savedSecret) {
      setModal({
        isOpen: true,
        type: 'prompt',
        variant: 'secure',
        isPassword: true,
        title: 'Admin Authorization Required 🔐',
        message: 'Please enter your Admin Password to unlock the creation editor.',
        placeholder: 'Enter Admin Password...',
        confirmText: 'Unlock Editor',
        onConfirm: (secret) => {
          if (!secret) {
            router.push('/');
            return;
          }
          sessionStorage.setItem('emowords-admin-secret', secret);
          setAuthHeader(secret);
          fetchPostData(secret);
        },
        onClose: () => router.push('/')
      });
    } else {
      setAuthHeader(savedSecret);
      fetchPostData(savedSecret);
    }
  }, [postId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'clean']
    ]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict empty post validation
    const titleTrimmed = (formData.title || '').trim();
    const contentCleaned = (formData.content || '').replace(/<[^>]*>?/gm, '').trim();
    const hasMedia = (formData.mediaList && formData.mediaList.length > 0) || formData.mediaUrl;

    if (!titleTrimmed && !contentCleaned && !hasMedia) {
      showAlert(
        'Empty Creation! ⚠️',
        'You cannot save an entirely blank creation. Please provide a Title, rich Content, or attach Media.',
        'warning'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        showAlert(
          'Updated Successfully! ✨',
          'Your edits have been permanently saved.',
          'success',
          () => router.push(`/post/${postId}`)
        );
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          sessionStorage.removeItem('emowords-admin-secret');
          showAlert('Unauthorized 🔒', 'Incorrect Admin Password! Cannot update creation.', 'error', () => router.push('/'));
        } else {
          showAlert('Update Error ❌', errorData.error || 'Failed to update post.', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showAlert('Network Error ❌', 'An unexpected error occurred while saving changes.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <div style={{ display: 'inline-block', width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
          {modal.isOpen ? 'Waiting for admin authorization...' : 'Loading creation editor...'}
        </p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <PopupModal
          isOpen={modal.isOpen}
          onClose={modal.onClose || (() => setModal(prev => ({ ...prev, isOpen: false })))}
          type={modal.type}
          variant={modal.variant}
          title={modal.title}
          message={modal.message}
          placeholder={modal.placeholder}
          confirmText={modal.confirmText}
          isPassword={modal.isPassword}
          onConfirm={modal.onConfirm}
        />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto glass animate-fade-in p-responsive" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="font-serif gradient-text mb-8" style={{ fontSize: '2.5rem', textAlign: 'center' }}>
          Edit Post
        </h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" style={{ fontWeight: 500 }}>Title (Optional)</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              placeholder="Give your post a title..."
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category" style={{ fontWeight: 500 }}>Category</label>
            <select 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem'
              }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="media" style={{ fontWeight: 500 }}>Upload Media (Multiple Images, Videos, or Audio)</label>
            <label style={{
              border: '2px dashed var(--border-color)',
              padding: '2rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              cursor: fileUploading ? 'wait' : 'pointer',
              backgroundColor: (formData.mediaList && formData.mediaList.length > 0) || formData.mediaUrl ? 'var(--bg-secondary)' : 'transparent',
              display: 'block',
              transition: 'all 0.2s ease'
            }}>
              {fileUploading ? '⏳ Uploading files to server...' : '📁 Click to browse or drag & drop multiple files here'}
              <input 
                type="file" 
                id="media" 
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt" 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
                disabled={fileUploading}
              />
            </label>

            {/* Display Attached Files List */}
            {formData.mediaList && formData.mediaList.length > 0 ? (
              <div className="flex flex-col gap-2 mt-2">
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  Attached Files ({formData.mediaList.length}):
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {formData.mediaList.map((item, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '0.75rem 1rem', 
                        backgroundColor: 'var(--bg-primary)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span>{item.type === 'video' ? '🎥' : item.type === 'audio' ? '🎵' : item.type === 'image' ? '🖼️' : '📄'}</span>
                        <span style={{ fontWeight: 500 }}>{item.name || `File #${idx + 1}`}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>({item.type})</span>
                      </span>
                      <button 
                        type="button" 
                        onClick={() => removeMediaItem(idx)}
                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '0 0.5rem' }}
                        title="Remove file"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : formData.mediaUrl ? (
              <button 
                type="button" 
                onClick={() => setFormData(prev => ({ ...prev, mediaUrl: '', mediaType: '', mediaList: [] }))}
                className="btn btn-outline"
                style={{ marginTop: '0.5rem', alignSelf: 'flex-start', padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#ef4444', borderColor: '#ef4444' }}
              >
                ✕ Remove Attached Media
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="content" style={{ fontWeight: 500 }}>Content (Rich Text)</label>
            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <ReactQuill 
                theme="snow"
                value={formData.content} 
                onChange={handleContentChange}
                modules={quillModules}
                style={{ height: '300px', color: '#000' }}
              />
            </div>
            {/* Added padding to prevent toolbar from overlapping the next element if it wraps, but ReactQuill handles this */}
            <div style={{ height: '42px' }}></div>
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={() => router.back()}
              style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
              style={{ padding: '0.75rem 2rem', fontSize: '1.125rem', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <PopupModal
        isOpen={modal.isOpen}
        onClose={modal.onClose || (() => setModal(prev => ({ ...prev, isOpen: false })))}
        type={modal.type}
        variant={modal.variant}
        title={modal.title}
        message={modal.message}
        placeholder={modal.placeholder}
        confirmText={modal.confirmText}
        isPassword={modal.isPassword}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
}
