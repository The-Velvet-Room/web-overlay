declare module 'pmx' {
    import * as express from 'express';
    
    export function expressErrorHandler(): express.ErrorRequestHandler;
    export function notify(message: string): void;
    export function notify(error: Error): void;
    export function notify(errorData: Object): void;
}