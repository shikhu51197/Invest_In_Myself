'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileUploading(true);
    let mediaType = 'image';
    if (file.type.startsWith('video/')) mediaType = 'video';
    else if (file.type.startsWith('audio/')) mediaType = 'audio';
    else if (!file.type.startsWith('image/')) mediaType = 'document';

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData(prev => ({
          ...prev,
          mediaUrl: data.url,
          mediaType: mediaType
        }));
      } else {
        alert(data.error || 'Failed to upload file.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading file to server.');
    } finally {
      setFileUploading(false);
    }
  };

  useEffect(() => {
    // Prompt for password right away
    const secret = prompt('Enter Admin Password to Edit:');
    if (!secret) {
      alert('Password required to edit.');
      router.push('/');
      return;
    }
    setAuthHeader(secret);

    // Fetch existing post data
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
            mediaType: post.mediaType || ''
          });
        } else {
          alert('Post not found.');
          router.push('/');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Failed to fetch post.');
      })
      .finally(() => {
        setLoading(false);
      });
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
        alert('Post updated successfully!');
        router.push(`/post/${postId}`);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'Failed to update post.');
        if (res.status === 401) {
          router.push('/'); // Incorrect password
        }
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="container py-12 text-center">Loading...</div>;

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
            <label htmlFor="media" style={{ fontWeight: 500 }}>Upload Media (Image / Video / Audio / Document)</label>
            <label style={{
              border: '2px dashed var(--border-color)',
              padding: '2rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              cursor: fileUploading ? 'wait' : 'pointer',
              backgroundColor: formData.mediaUrl ? 'var(--bg-secondary)' : 'transparent',
              display: 'block'
            }}>
              {fileUploading ? 'Uploading...' : formData.mediaUrl ? 'File Attached (Click to replace)' : 'Click to browse or drag and drop a file here.'}
              <input 
                type="file" 
                id="media" 
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt" 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
                disabled={fileUploading}
              />
            </label>
            {formData.mediaUrl && (
              <button 
                type="button" 
                onClick={() => setFormData(prev => ({ ...prev, mediaUrl: '', mediaType: '' }))}
                className="btn btn-outline"
                style={{ marginTop: '0.5rem', alignSelf: 'flex-start', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              >
                Remove Media
              </button>
            )}
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
    </div>
  );
}
