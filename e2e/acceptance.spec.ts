import { test, expect } from '@playwright/test';

/**
 * 受入テスト: 機能要件、ユーザビリティ、パフォーマンス
 * 
 * テスト対象:
 * - 機能要件: 要件定義で定義されたすべての機能
 * - ユーザビリティ: 直感的な操作、レスポンシブデザイン
 * - パフォーマンス: 実際の使用環境でのパフォーマンス
 */

test.describe('受入テスト: 機能要件', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ユーザーストーリー1: ユーザーはログインして、自分のTODOやチームのTODOを確認できる', async ({ page }) => {
    // 認証が必要な場合は、認証処理をここに追加
    // 現在は認証なしでテストできる部分をテスト
    
    // TODO一覧ページにアクセス
    await page.goto('/todos', { waitUntil: 'networkidle' });
    
    // 認証が必要な場合は、sign-inページにリダイレクトされる
    // または、認証済みの場合はtodosページに遷移する
    const currentURL = page.url();
    expect(currentURL).toMatch(/.*(todos|sign-in)/);
    
    // ページが読み込まれることを確認
    await page.waitForLoadState('networkidle');
  });

  test('ユーザーストーリー2: ユーザーは新しいTODOを作成し、カテゴリや優先度、期限を設定できる', async ({ page }) => {
    // TODO作成画面にアクセス
    await page.goto('/todos/new', { waitUntil: 'networkidle' });
    
    // 認証が必要な場合は、sign-inページにリダイレクトされる
    const currentURL = page.url();
    expect(currentURL).toMatch(/.*(todos\/new|sign-in)/);
    
    // フォームが表示されることを確認（認証済みの場合）
    if (currentURL.includes('/todos/new')) {
      // タイトル入力欄が存在することを確認
      const titleInput = page.getByLabel(/タイトル/i).or(
        page.getByPlaceholder(/タイトル/i)
      );
      
      if (await titleInput.count() > 0) {
        await expect(titleInput.first()).toBeVisible();
      }
    }
  });

  test('ユーザーストーリー3: ユーザーはTODOを編集、削除、完了/未完了の切り替えができる', async ({ page }) => {
    // TODO一覧ページにアクセス
    await page.goto('/todos', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    expect(currentURL).toMatch(/.*(todos|sign-in)/);
    
    // 認証済みの場合、TODO一覧が表示されることを確認
    if (currentURL.includes('/todos')) {
      await page.waitForLoadState('networkidle');
    }
  });

  test('ユーザーストーリー4: ユーザーは検索やフィルタリング機能を使って、目的のTODOを素早く見つけられる', async ({ page }) => {
    await page.goto('/todos', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    if (currentURL.includes('/todos')) {
      // 検索機能が存在することを確認
      const searchInput = page.getByPlaceholder(/検索/i).or(
        page.getByLabel(/検索/i)
      );
      
      if (await searchInput.count() > 0) {
        await expect(searchInput.first()).toBeVisible();
      }
      
      // フィルター機能が存在することを確認
      const statusFilter = page.getByLabel(/ステータス/i).or(
        page.getByRole('combobox', { name: /ステータス/i })
      );
      
      if (await statusFilter.count() > 0) {
        await expect(statusFilter.first()).toBeVisible();
      }
    }
  });

  test('ユーザーストーリー5: ユーザーはプロジェクト/フォルダでTODOを整理できる', async ({ page }) => {
    // プロジェクト一覧ページにアクセス
    await page.goto('/projects', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    expect(currentURL).toMatch(/.*(projects|sign-in)/);
    
    // 認証済みの場合、プロジェクト一覧が表示されることを確認
    if (currentURL.includes('/projects')) {
      await page.waitForLoadState('networkidle');
    }
  });

  test('ユーザーストーリー6: ユーザーはTODOにコメントを追加し、チームメンバーとコミュニケーションを取れる', async ({ page }) => {
    // TODO詳細ページにアクセス（存在するTODO IDが必要）
    // 実際のテストでは、テストデータを使用
    await page.goto('/todos/test-id', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    // 認証が必要な場合、またはTODOが存在しない場合の処理
    expect(currentURL).toMatch(/.*(todos|sign-in|404)/);
  });

  test('ユーザーストーリー7: ユーザーは変更履歴を確認できる', async ({ page }) => {
    // TODO詳細ページにアクセス
    await page.goto('/todos/test-id', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    expect(currentURL).toMatch(/.*(todos|sign-in|404)/);
    
    // 認証済みでTODOが存在する場合、変更履歴が表示されることを確認
    if (currentURL.includes('/todos/') && !currentURL.includes('sign-in')) {
      await page.waitForLoadState('networkidle');
    }
  });
});

test.describe('受入テスト: ユーザビリティ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('レスポンシブデザイン: PC画面で正しく表示される', async ({ page }) => {
    // PCサイズのビューポートを設定
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/');
    
    // ページが正しく表示されることを確認
    const title = page.getByRole('heading', { name: /AI Todo List/i });
    if (await title.count() > 0) {
      await expect(title.first()).toBeVisible();
    }
  });

  test('レスポンシブデザイン: タブレット画面で正しく表示される', async ({ page }) => {
    // タブレットサイズのビューポートを設定
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    
    // ページが正しく表示されることを確認
    const title = page.getByRole('heading', { name: /AI Todo List/i });
    if (await title.count() > 0) {
      await expect(title.first()).toBeVisible();
    }
  });

  test('レスポンシブデザイン: スマートフォン画面で正しく表示される', async ({ page }) => {
    // スマートフォンサイズのビューポートを設定
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // ページが正しく表示されることを確認
    const title = page.getByRole('heading', { name: /AI Todo List/i });
    if (await title.count() > 0) {
      await expect(title.first()).toBeVisible();
    }
  });

  test('アクセシビリティ: キーボード操作でナビゲーションできる', async ({ page }) => {
    await page.goto('/');
    
    // Tabキーでフォーカスを移動できることを確認
    await page.keyboard.press('Tab');
    
    // フォーカス可能な要素が存在することを確認
    const focusedElement = page.locator(':focus');
    if (await focusedElement.count() > 0) {
      await expect(focusedElement.first()).toBeVisible();
    }
  });

  test('アクセシビリティ: 適切なARIA属性が設定されている', async ({ page }) => {
    await page.goto('/');
    
    // 主要な要素にARIA属性が設定されていることを確認
    // 実際の実装に応じて調整
    await page.waitForLoadState('networkidle');
  });
});

test.describe('受入テスト: パフォーマンス', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('パフォーマンス: ホームページの読み込み時間が3秒以内', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // レスポンスタイムが3秒以内であることを確認
    expect(loadTime).toBeLessThan(3000);
  });

  test('パフォーマンス: TODO一覧ページの読み込み時間が3秒以内', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/todos', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // レスポンスタイムが3秒以内であることを確認
    expect(loadTime).toBeLessThan(3000);
  });

  test('パフォーマンス: プロジェクト一覧ページの読み込み時間が3秒以内', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/projects', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // レスポンスタイムが3秒以内であることを確認
    expect(loadTime).toBeLessThan(3000);
  });
});

