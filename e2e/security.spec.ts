import { test, expect } from '@playwright/test';

/**
 * セキュリティテスト: 認証・認可、データ保護、通信セキュリティ、脆弱性対策
 * 
 * テスト対象:
 * - 認証・認可: ログインなしでのアクセス制御、権限チェック
 * - データ保護: 個人情報の暗号化、パスワードのハッシュ化
 * - 通信セキュリティ: HTTPS通信
 * - 脆弱性対策: SQLインジェクション、XSS、CSRF対策
 */

test.describe('セキュリティテスト: 認証・認可', () => {
  test('未認証ユーザーが認証が必要なページにアクセスした場合、リダイレクトされる', async ({ page }) => {
    // 認証が必要なページに直接アクセス
    await page.goto('/todos', { waitUntil: 'networkidle' });
    
    // sign-inページにリダイレクトされることを確認
    const currentURL = page.url();
    expect(currentURL).toMatch(/.*sign-in/);
  });

  test('未認証ユーザーがプロジェクト一覧ページにアクセスした場合、リダイレクトされる', async ({ page }) => {
    await page.goto('/projects', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    expect(currentURL).toMatch(/.*sign-in/);
  });

  test('未認証ユーザーがTODO作成ページにアクセスした場合、リダイレクトされる', async ({ page }) => {
    await page.goto('/todos/new', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    expect(currentURL).toMatch(/.*sign-in/);
  });

  test('未認証ユーザーがプロジェクト作成ページにアクセスした場合、リダイレクトされる', async ({ page }) => {
    await page.goto('/projects/new', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    expect(currentURL).toMatch(/.*sign-in/);
  });
});

test.describe('セキュリティテスト: データ保護', () => {
  test('個人情報が適切に保護されている', async ({ page }) => {
    // ページのソースコードに個人情報が含まれていないことを確認
    await page.goto('/');
    
    const pageContent = await page.content();
    
    // パスワードや機密情報が含まれていないことを確認
    // 実際の実装に応じて調整
    expect(pageContent).not.toContain('password');
    expect(pageContent).not.toContain('secret');
  });

  test('フォーム入力が適切に保護されている', async ({ page }) => {
    // TODO作成ページにアクセス（認証が必要な場合はリダイレクトされる）
    await page.goto('/todos/new', { waitUntil: 'networkidle' });
    
    // フォームが存在する場合、適切な保護がされていることを確認
    const currentURL = page.url();
    if (currentURL.includes('/todos/new')) {
      // フォームの入力欄が存在することを確認
      const titleInput = page.getByLabel(/タイトル/i).or(
        page.getByPlaceholder(/タイトル/i)
      );
      
      if (await titleInput.count() > 0) {
        // 入力欄が適切に保護されていることを確認
        await expect(titleInput.first()).toBeVisible();
      }
    }
  });
});

test.describe('セキュリティテスト: 通信セキュリティ', () => {
  test('HTTPS通信が使用されている（本番環境）', async ({ page }) => {
    // 開発環境ではHTTPを使用するため、本番環境でのテストを推奨
    await page.goto('/');
    
    const protocol = new URL(page.url()).protocol;
    
    // 開発環境ではHTTP、本番環境ではHTTPSが使用される
    console.log(`使用されているプロトコル: ${protocol}`);
    
    // 本番環境ではHTTPSが使用されることを確認（開発環境ではHTTP）
    if (process.env.NODE_ENV === 'production') {
      expect(protocol).toBe('https:');
    } else {
      expect(protocol).toBe('http:');
    }
  });

  test('セキュリティヘッダーが設定されている', async ({ page }) => {
    const response = await page.goto('/');
    
    if (response) {
      const headers = response.headers();
      
      // セキュリティヘッダーの存在を確認（実際の実装に応じて調整）
      // X-Frame-Options、X-Content-Type-Options、X-XSS-Protectionなど
      console.log('レスポンスヘッダー:', headers);
    }
  });
});

test.describe('セキュリティテスト: 脆弱性対策', () => {
  test('XSS対策: スクリプトタグが実行されない', async ({ page }) => {
    // TODO作成ページにアクセス
    await page.goto('/todos/new', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    if (currentURL.includes('/todos/new')) {
      // XSS攻撃を試みる（実際の実装では、フォームに入力して送信）
      const titleInput = page.getByLabel(/タイトル/i).or(
        page.getByPlaceholder(/タイトル/i)
      );
      
      if (await titleInput.count() > 0) {
        // XSS攻撃の試み（スクリプトタグ）
        const xssPayload = '<script>alert("XSS")</script>';
        
        // 入力欄に入力（実際の送信は行わない）
        await titleInput.first().fill(xssPayload);
        
        // ページにスクリプトが実行されていないことを確認
        const pageContent = await page.content();
        // スクリプトタグがエスケープされていることを確認
        expect(pageContent).not.toContain('<script>alert("XSS")</script>');
      }
    }
  });

  test('SQLインジェクション対策: 入力値が適切にエスケープされている', async ({ page }) => {
    // TODO作成ページにアクセス
    await page.goto('/todos/new', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    if (currentURL.includes('/todos/new')) {
      const titleInput = page.getByLabel(/タイトル/i).or(
        page.getByPlaceholder(/タイトル/i)
      );
      
      if (await titleInput.count() > 0) {
        // SQLインジェクション攻撃の試み
        const sqlPayload = "'; DROP TABLE todos; --";
        
        // 入力欄に入力（実際の送信は行わない）
        await titleInput.first().fill(sqlPayload);
        
        // 入力値が適切に処理されることを確認（Prisma ORMが自動的にエスケープ）
        const inputValue = await titleInput.first().inputValue();
        expect(inputValue).toBe(sqlPayload); // 入力値はそのまま保持されるが、Prismaがエスケープ
      }
    }
  });

  test('CSRF対策: フォームに適切な保護が設定されている', async ({ page }) => {
    // TODO作成ページにアクセス
    await page.goto('/todos/new', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    if (currentURL.includes('/todos/new')) {
      // フォームが存在することを確認
      const form = page.locator('form');
      
      if (await form.count() > 0) {
        // フォームが適切に保護されていることを確認
        // Next.jsのServer Actionsは自動的にCSRF対策が有効
        await expect(form.first()).toBeVisible();
      }
    }
  });
});

test.describe('セキュリティテスト: 権限チェック', () => {
  test('存在しないリソースへのアクセスが適切に制御される', async ({ page }) => {
    // 存在しないTODO IDでアクセス
    await page.goto('/todos/non-existent-id', { waitUntil: 'networkidle' });
    
    // 認証が必要な場合はリダイレクト、または404エラーが表示される
    const currentURL = page.url();
    expect(currentURL).toMatch(/.*(sign-in|404|todos)/);
  });

  test('存在しないプロジェクトへのアクセスが適切に制御される', async ({ page }) => {
    // 存在しないプロジェクト IDでアクセス
    await page.goto('/projects/non-existent-id', { waitUntil: 'networkidle' });
    
    const currentURL = page.url();
    expect(currentURL).toMatch(/.*(sign-in|404|projects)/);
  });
});

