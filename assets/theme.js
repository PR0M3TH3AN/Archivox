document.addEventListener('DOMContentLoaded', () => {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }
  const stored = localStorage.getItem('theme');
  if (stored) setTheme(stored);

  sidebarToggle?.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open');
  });

  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  // breadcrumbs
  const bc = document.getElementById('breadcrumbs');
  if (bc) {
    const parts = location.pathname.split('/').filter(Boolean);
    let path = '';
    bc.innerHTML = '<a href="/">Home</a>';
    parts.forEach((p) => {
      path += '/' + p;
      bc.innerHTML += ' / <a href="' + path + '">' + p.replace(/-/g, ' ') + '</a>';
    });
  }
});
