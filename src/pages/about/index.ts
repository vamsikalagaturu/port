import './styles.css';

export function About(): HTMLElement {
  const about = document.createElement('div');
  about.className = 'about';
  about.innerHTML = `
    <h1>About Vamsi Kalagaturu</h1>
    <p>This is the about page.</p>
  `;
  return about;
}
