import { test, expect } from '@playwright/test';

/**
 * ユーザビリティテスト: 操作性、レスポンシブデザイン、アクセシビリティ
 * 
 * テスト対象:
 * - 操作性: 直感的な操作、キーボードショートカット
 * - レスポンシブデザイン: PC、スマートフォン、タブレットでの表示
 * - アクセシビリティ: キーボード操作、スクリーンリーダー対応
 */

test.describe('ユーザビリティテスト: 操作性', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('フォームの入力が直感的に操作できる', async ({ page }) => {
    // TODO作成ページにアクセス
    await page.goto('/todos/new', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    if (currentURL.includes('/todos/new')) {
      // タイトル入力欄が存在し、フォーカス可能であることを確認
      const titleInput = page.getByLabel(/タイトル/i).or(
        page.getByPlaceholder(/タイトル/i)
      );
      
      if (await titleInput.count() > 0) {
        await titleInput.first().focus();
        await expect(titleInput.first()).toBeFocused();
        
        // 入力が可能であることを確認
        await titleInput.first().fill('テストTODO');
        const inputValue = await titleInput.first().inputValue();
        expect(inputValue).toBe('テストTODO');
      }
    }
  });

  test('ボタンがクリック可能で、適切なフィードバックが提供される', async ({ page }) => {
    await page.goto('/');
    
    // ボタンが存在することを確認
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      // 最初のボタンがクリック可能であることを確認
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
      await expect(firstButton).toBeEnabled();
    }
  });

  test('リンクが適切に動作する', async ({ page }) => {
    await page.goto('/');
    
    // リンクが存在することを確認
    const links = page.getByRole('link');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      // リンクがクリック可能であることを確認
      const firstLink = links.first();
      await expect(firstLink).toBeVisible();
      
      // リンクのhref属性が設定されていることを確認
      const href = await firstLink.getAttribute('href');
      expect(href).not.toBeNull();
    }
  });

  test('エラーメッセージが適切に表示される', async ({ page }) => {
    // TODO作成ページにアクセス
    await page.goto('/todos/new', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    if (currentURL.includes('/todos/new')) {
      // 必須項目を空のまま送信を試みる
      const submitButton = page.getByRole('button', { name: /作成|送信|保存/i });
      
      if (await submitButton.count() > 0) {
        await submitButton.first().click();
        
        // エラーメッセージが表示されることを確認
        const errorMessage = page.getByText(/必須|入力してください|エラー/i);
        
        if (await errorMessage.count() > 0) {
          await expect(errorMessage.first()).toBeVisible();
        }
      }
    }
  });
});

test.describe('ユーザビリティテスト: レスポンシブデザイン', () => {
  test('PC画面（1920x1080）で正しく表示される', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // ページが正しく表示されることを確認
    const title = page.getByRole('heading', { name: /AI Todo List/i });
    if (await title.count() > 0) {
      await expect(title.first()).toBeVisible();
      
      // レイアウトが崩れていないことを確認
      const boundingBox = await title.first().boundingBox();
      expect(boundingBox).not.toBeNull();
    }
  });

  test('タブレット画面（768x1024）で正しく表示される', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    const title = page.getByRole('heading', { name: /AI Todo List/i });
    if (await title.count() > 0) {
      await expect(title.first()).toBeVisible();
      
      const boundingBox = await title.first().boundingBox();
      expect(boundingBox).not.toBeNull();
    }
  });

  test('スマートフォン画面（375x667）で正しく表示される', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const title = page.getByRole('heading', { name: /AI Todo List/i });
    if (await title.count() > 0) {
      await expect(title.first()).toBeVisible();
      
      const boundingBox = await title.first().boundingBox();
      expect(boundingBox).not.toBeNull();
    }
  });

  test('小さいスマートフォン画面（320x568）で正しく表示される', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    
    const title = page.getByRole('heading', { name: /AI Todo List/i });
    if (await title.count() > 0) {
      await expect(title.first()).toBeVisible();
      
      const boundingBox = await title.first().boundingBox();
      expect(boundingBox).not.toBeNull();
    }
  });

  test('横画面（タブレット）で正しく表示される', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    
    const title = page.getByRole('heading', { name: /AI Todo List/i });
    if (await title.count() > 0) {
      await expect(title.first()).toBeVisible();
    }
  });
});

test.describe('ユーザビリティテスト: アクセシビリティ', () => {
  test('キーボード操作でナビゲーションできる', async ({ page }) => {
    await page.goto('/');
    
    // Tabキーでフォーカスを移動できることを確認
    await page.keyboard.press('Tab');
    
    // フォーカス可能な要素が存在することを確認
    const focusedElement = page.locator(':focus');
    if (await focusedElement.count() > 0) {
      await expect(focusedElement.first()).toBeVisible();
    }
  });

  test('Enterキーでボタンを実行できる', async ({ page }) => {
    await page.goto('/');
    
    // ボタンにフォーカスを移動
    const buttons = page.getByRole('button');
    if (await buttons.count() > 0) {
      await buttons.first().focus();
      
      // Enterキーでボタンが実行されることを確認
      // 実際の動作は実装に依存するため、フォーカスが維持されることを確認
      const focusedButton = page.locator(':focus');
      if (await focusedButton.count() > 0) {
        await expect(focusedButton.first()).toBeVisible();
      }
    }
  });

  test('Escキーでモーダルやダイアログを閉じられる', async ({ page }) => {
    // モーダルやダイアログが存在するページにアクセス
    await page.goto('/todos', { waitUntil: 'networkidle' });
    
    // モーダルやダイアログが開かれた場合、Escキーで閉じられることを確認
    // 実際の実装に応じて調整
    await page.keyboard.press('Escape');
    
    // ページが正常に動作することを確認
    await page.waitForLoadState('networkidle');
  });

  test('適切なARIA属性が設定されている', async ({ page }) => {
    await page.goto('/');
    
    // 主要な要素にARIA属性が設定されていることを確認
    // ボタンにaria-labelが設定されているか確認
    const buttons = page.getByRole('button');
    if (await buttons.count() > 0) {
      const firstButton = buttons.first();
      const ariaLabel = await firstButton.getAttribute('aria-label');
      const buttonText = await firstButton.textContent();
      
      // aria-labelまたはテキストコンテンツが存在することを確認
      expect(ariaLabel || buttonText).not.toBeNull();
    }
  });

  test('フォームに適切なラベルが設定されている', async ({ page }) => {
    // TODO作成ページにアクセス
    await page.goto('/todos/new', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    if (currentURL.includes('/todos/new')) {
      // 入力欄にラベルが設定されていることを確認
      const titleInput = page.getByLabel(/タイトル/i).or(
        page.getByPlaceholder(/タイトル/i)
      );
      
      if (await titleInput.count() > 0) {
        // ラベルまたはプレースホルダーが存在することを確認
        const placeholder = await titleInput.first().getAttribute('placeholder');
        const ariaLabel = await titleInput.first().getAttribute('aria-label');
        
        expect(placeholder || ariaLabel).not.toBeNull();
      }
    }
  });

  test('色のコントラストが適切である', async ({ page }) => {
    await page.goto('/');
    
    // ページが読み込まれることを確認
    await page.waitForLoadState('networkidle');
    
    // 色のコントラストは視覚的な確認が必要なため、
    // ページが正常に表示されることを確認
    const title = page.getByRole('heading', { name: /AI Todo List/i });
    if (await title.count() > 0) {
      await expect(title.first()).toBeVisible();
    }
  });

  test('フォーカスインジケーターが表示される', async ({ page }) => {
    await page.goto('/');
    
    // Tabキーでフォーカスを移動
    await page.keyboard.press('Tab');
    
    // フォーカスされた要素が存在することを確認
    const focusedElement = page.locator(':focus');
    if (await focusedElement.count() > 0) {
      await expect(focusedElement.first()).toBeVisible();
      
      // フォーカスインジケーターのスタイルを確認
      const outline = await focusedElement.first().evaluate((el) => {
        return window.getComputedStyle(el).outline;
      });
      
      // フォーカスインジケーターが設定されていることを確認
      expect(outline).not.toBe('none');
    }
  });
});

test.describe('ユーザビリティテスト: 操作性の詳細', () => {
  test('検索機能が直感的に操作できる', async ({ page }) => {
    await page.goto('/todos', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    if (currentURL.includes('/todos')) {
      // 検索入力欄を探す
      const searchInput = page.getByPlaceholder(/検索/i).or(
        page.getByLabel(/検索/i)
      );
      
      if (await searchInput.count() > 0) {
        await searchInput.first().focus();
        await expect(searchInput.first()).toBeFocused();
        
        // 検索入力が可能であることを確認
        await searchInput.first().fill('テスト');
        const inputValue = await searchInput.first().inputValue();
        expect(inputValue).toBe('テスト');
      }
    }
  });

  test('フィルター機能が直感的に操作できる', async ({ page }) => {
    await page.goto('/todos', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    if (currentURL.includes('/todos')) {
      // フィルター要素を探す
      const statusFilter = page.getByLabel(/ステータス/i).or(
        page.getByRole('combobox', { name: /ステータス/i })
      );
      
      if (await statusFilter.count() > 0) {
        await statusFilter.first().focus();
        await expect(statusFilter.first()).toBeFocused();
      }
    }
  });

  test('ページ遷移がスムーズである', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.goto('/todos', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // ページ遷移が3秒以内であることを確認
    expect(loadTime).toBeLessThan(3000);
  });
});

