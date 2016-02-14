import { TSView } from './interface.ts';

export class ErrorView implements TSView {
    static render(data: any): string {
        return `
            <!doctype html>
            <html>
            <head>
                <title>Web Overlay</title>
            </head>
            <body>
                <h1>${data.message}</h1>
                <h2>${data.error.status}</h2>
                <pre>${data.error.stack}</pre>
            </body>
            </html>
        `
    }
}