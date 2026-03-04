// Custom toast notification
let toastTimeout = null;

const showToast = (message) => {
  // Remove existing toast if any
  const existingToast = document.getElementById('copy-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'copy-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-text);
    color: var(--color-bg);
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 500;
    z-index: 10000;
    animation: slideUp 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(toast);

  // Remove after 2 seconds
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.animation = 'slideUp 0.3s ease reverse';
    setTimeout(() => {
      toast.remove();
      style.remove();
    }, 300);
  }, 2000);
};

export const copyToClipboard = async (text) => {
  try {
    // Modern API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error('Copy failed:', error);
    return false;
  }
};

export const copyWithFeedback = async (text, message = 'Copied!') => {
  const success = await copyToClipboard(text);
  if (success) {
    showToast(message);
  }
  return success;
};
