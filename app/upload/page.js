'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Poetry', 'Shayri', 'Songs', 'Sketches', 'Recipes', 'Blogs', 'Thoughts', 'Advice'];

export default function Upload() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Thoughts',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert('Post published successfully!');
        router.push('/');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'Failed to publish post.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto glass animate-fade-in" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="font-serif gradient-text mb-8" style={{ fontSize: '2.5rem', textAlign: 'center' }}>
          Create New Post
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
            <label htmlFor="media" style={{ fontWeight: 500 }}>Upload Media (Image/Video)</label>
            <div style={{
              border: '2px dashed var(--border-color)',
              padding: '2rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}>
              Click to browse or drag and drop a file here.
              <input type="file" id="media" accept="image/*,video/*" style={{ display: 'none' }} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="content" style={{ fontWeight: 500 }}>Content (Unlimited Text)</label>
            <textarea 
              id="content" 
              name="content" 
              value={formData.content} 
              onChange={handleChange}
              required
              placeholder="Write your heart out... HTML is supported for rich text formatting."
              rows="12"
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            ></textarea>
          </div>

          <div className="mt-4 flex justify-end">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
              style={{ padding: '0.75rem 2rem', fontSize: '1.125rem', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
