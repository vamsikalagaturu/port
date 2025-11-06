import './styles.css';

export function Page404(): HTMLElement {
  const page404 = document.createElement('div');
  page404.className = 'page-404';
  page404.innerHTML = `
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  `;
  return page404;
}
