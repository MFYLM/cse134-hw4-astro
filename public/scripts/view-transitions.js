function supportsViewTransitions() {
  return 'startViewTransition' in document;
}

async function navigateWithTransition(url) {
  if (!supportsViewTransitions()) {
    // Fallback to regular navigation if API not supported
    window.location.href = url;
    return;
  }

  // Start the view transition
  const transition = document.startViewTransition(async () => {
    // Fetch the new page content
    const response = await fetch(url);
    const html = await response.text();
    
    // Parse the HTML
    const parser = new DOMParser();
    const newDocument = parser.parseFromString(html, 'text/html');
    
    // Update the document title
    document.title = newDocument.title;
    
    // Update the body content
    document.body.innerHTML = newDocument.body.innerHTML;
    
    // Re-run scripts if needed (theme manager, etc.)
    const scripts = document.body.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
    
    // Update browser history
    window.history.pushState({}, '', url);
  });

  try {
    await transition.finished;
  } catch (error) {
    console.error('View transition failed:', error);
  }
}

function handleLinkClick(event) {
  // Only handle left clicks
  if (event.button !== 0) return;
  
  // Ignore if modifier keys are pressed
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  
  // Find the closest anchor tag
  const link = event.target.closest('a');
  if (!link) return;
  
  // Only handle same-origin links
  const url = new URL(link.href);
  if (url.origin !== window.location.origin) return;
  
  // Prevent default navigation
  event.preventDefault();
  
  // Navigate with transition
  navigateWithTransition(link.href);
}

function handlePopState(event) {
  if (supportsViewTransitions()) {
    navigateWithTransition(window.location.href);
  }
}

function init() {
  if (!supportsViewTransitions()) {
    console.warn('View Transition API not supported in this browser');
    return;
  }
  
  // Intercept all link clicks
  document.addEventListener('click', handleLinkClick);
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', handlePopState);
  
  console.log('Native View Transition API initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

