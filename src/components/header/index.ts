import './styles.css';

export function Header() : HTMLElement {
  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <nav class="nav">
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  `;
  return header;
}
