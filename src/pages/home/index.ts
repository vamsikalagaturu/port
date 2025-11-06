import './styles.css'
import { setupCounter } from '../../counter.ts'

export function Home() : HTMLElement {
  const home = document.createElement('div');
  home.className = 'home';
  home.innerHTML = `
    <h1>Vamsi Kalagaturu</h1>
    <div class="card">
        <button id="counter" type="button"></button>
    </div>
  `;

  const counterButton = home.querySelector<HTMLButtonElement>('#counter');
  if (counterButton) {
    setupCounter(counterButton);
  }
  return home;
}

