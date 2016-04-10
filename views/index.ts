import { TSView } from './interface';

export class IndexView implements TSView {
    static render(data: any): string {
        return `
            <!doctype html>
            <html>
            <head>
                <title>Web Overlay</title>
            </head>
            <body>
                <div id="root"></div>
                <script src="/bundle.js"></script>
            </body>
            </html>
        `
    }
}
