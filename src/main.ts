import './styles.css'
import { Header } from './components/header/index.ts'
import { Home } from './pages/home/index.ts'
import { About } from './pages/about/index.ts'
import { Page404 } from './pages/404/index.ts'

const app = document.querySelector<HTMLDivElement>('#app')!;
app.appendChild(Header());
const contentDiv = document.createElement('div');
contentDiv.id = 'content';
app.appendChild(contentDiv);

function renderRoute(pathname: string) {
    const content = document.getElementById('content')!;
    content.innerHTML = ''; // Clear previous content

    switch (pathname) {
        case '/':
            content.appendChild(Home());
            break;
        case '/about':
            content.appendChild(About());
            break;
        default:
            content.appendChild(Page404());
            break;
    }
}

// Initial render
renderRoute(window.location.pathname);

const nav = window.navigation;
nav.addEventListener('navigate', (event: NavigateEvent) => {
    event.intercept();
    const url = new URL(event.destination.url);
    renderRoute(url.pathname);
});
