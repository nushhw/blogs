
class BlogSystem {
    constructor() {
        this.posts = this.loadPosts();
        this.initEventListeners();
        this.renderPosts();
    }

    initEventListeners() {
        const postForm = document.getElementById('postForm');
        postForm.addEventListener('submit', (e) => this.handlePostSubmit(e));
    }

    handlePostSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('postTitle').value.trim();
        const content = document.getElementById('postContent').value.trim();
        const tagsInput = document.getElementById('postTags').value.trim();
        
        if (!title || !content) {
            alert('Please fill in both title and content!');
            return;
        }

        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
        
        const post = {
            id: Date.now(),
            title,
            content,
            tags,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        this.posts.unshift(post);
        this.savePosts();
        this.renderPosts();
        this.clearForm();
        
        // Show success message
        this.showNotification('Post published successfully!', 'success');
    }

    deletePost(postId) {
        if (confirm('Are you sure you want to delete this post?')) {
            this.posts = this.posts.filter(post => post.id !== postId);
            this.savePosts();
            this.renderPosts();
            this.showNotification('Post deleted successfully!', 'danger');
        }
    }

    renderPosts() {
        const postsContainer = document.getElementById('postsContainer');
        const noPosts = document.getElementById('noPosts');
        
        if (this.posts.length === 0) {
            postsContainer.style.display = 'none';
            noPosts.style.display = 'block';
            return;
        }
        
        postsContainer.style.display = 'grid';
        noPosts.style.display = 'none';
        
        postsContainer.innerHTML = this.posts.map(post => `
            <article class="post-card">
                <div class="post-header">
                    <h3 class="post-title">${this.escapeHtml(post.title)}</h3>
                    <span class="post-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${post.date}
                    </span>
                </div>
                <div class="post-content">${this.escapeHtml(post.content).replace(/\n/g, '<br>')}</div>
                ${post.tags.length > 0 ? `
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag"># ${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="post-actions">
                    <button class="btn btn-danger" onclick="blog.deletePost(${post.id})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </article>
        `).join('');
    }

    clearForm() {
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
        document.getElementById('postTags').value = '';
    }

    loadPosts() {
        const saved = localStorage.getItem('blogPosts');
        return saved ? JSON.parse(saved) : [];
    }

    savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the blog system when the page loads
let blog;
document.addEventListener('DOMContentLoaded', () => {
    blog = new BlogSystem();
});
