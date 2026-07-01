import { type Express } from 'express';

export const name = 'root';

export function register (app: Express): void {
    app.get('/', (_, res) => {
        res.sendStatus(404);
    });
}
