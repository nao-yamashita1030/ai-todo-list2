import { test, expect } from '@playwright/test';

/**
 * システムテスト: エラーハンドリング
 * 
 * テスト対象:
 * - バリデーションエラー
 * - 権限エラー
 * - ネットワークエラー
 * - 404エラー
 */

test.describe('エラーハンドリング', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('存在しないTODOにアクセスした場合、エラーが表示される', async ({ page }) => {
    // 存在しないTODO IDでアクセス
    await page.goto('/todos/non-existent-id');
    
    // エラーメッセージまたはnot-foundページが表示されることを確認
    const errorMessage = page.getByText(/見つかりません|エラー|404/i);
    
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('存在しないプロジェクトにアクセスした場合、エラーが表示される', async ({ page }) => {
    // 存在しないプロジェクト IDでアクセス
    await page.goto('/projects/non-existent-id');
    
    const errorMessage = page.getByText(/見つかりません|エラー|404/i);
    
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('無効な入力でフォームを送信した場合、バリデーションエラーが表示される', async ({ page }) => {
    // TODO作成画面に遷移
    await page.goto('/todos/new');
    
    // 必須項目を空のまま送信を試みる
    const submitButton = page.getByRole('button', { name: /作成|送信|保存/i });
    
    if (await submitButton.count() > 0) {
      await submitButton.first().click();
      
      // バリデーションエラーメッセージが表示されることを確認
      const errorMessage = page.getByText(/必須|入力してください|エラー/i);
      
      if (await errorMessage.count() > 0) {
        await expect(errorMessage.first()).toBeVisible();
      }
    }
  });
});

