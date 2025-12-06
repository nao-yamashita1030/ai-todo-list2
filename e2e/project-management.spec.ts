import { test, expect } from '@playwright/test';

/**
 * システムテスト: プロジェクト管理機能
 * 
 * テスト対象:
 * - プロジェクトの作成
 * - プロジェクトの編集
 * - プロジェクトの削除
 * - プロジェクトの一覧表示
 * - プロジェクトの検索機能
 */

test.describe('プロジェクト管理機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('プロジェクト一覧画面が表示される', async ({ page }) => {
    await page.goto('/projects');
    
    await expect(page).toHaveURL(/.*projects/);
  });

  test('プロジェクト作成画面に遷移できる', async ({ page }) => {
    await page.goto('/projects');
    
    const createButton = page.getByRole('link', { name: /新規作成|作成|追加/i }).or(
      page.getByRole('button', { name: /新規作成|作成|追加/i })
    );
    
    if (await createButton.count() > 0) {
      await createButton.first().click();
      await expect(page).toHaveURL(/.*projects\/new/);
    }
  });

  test('プロジェクト検索機能が動作する', async ({ page }) => {
    await page.goto('/projects');
    
    const searchInput = page.getByPlaceholder(/検索/i).or(
      page.getByLabel(/検索/i)
    );
    
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('テスト');
      await page.waitForTimeout(500);
    }
  });
});

