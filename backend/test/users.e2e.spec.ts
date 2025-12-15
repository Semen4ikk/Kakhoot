    import { test, expect } from '@playwright/test';
    import * as path from 'path';

    const PROJECT_ROOT = 'D:/Kakhoot/frontend';

    const toFileUrl = (filename: string) => {
        const fullPath = path.join(PROJECT_ROOT, 'pages', filename);
        return `file://${fullPath.replace(/\\/g, '/')}`;
    };

    test.describe('E2E: Пользовательские сценарии (file://)', () => {
        test.beforeEach(async ({ page }) => {

        });

        test('1. Успешная авторизация → главная страница', async ({ page }) => {
            test.setTimeout(10_000);
        });

        test('2. Прохождение квиза → возврат на главную', async ({ page }) => {
            test.setTimeout(10_000);
        });
    });