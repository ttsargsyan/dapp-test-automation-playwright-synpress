import { type Page, type Locator } from "@playwright/test";
import BasePage from "./base.page";

export default class HomePage extends BasePage {
  readonly path: string;
  readonly textWalletNotConnected: Locator;
  readonly tableCitizens: Locator;
  readonly textTotalRecordsCount: Locator;
  readonly citizenRows: Locator;
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly modalText: Locator;
  readonly closeBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.path = "/";

    // Locators
    this.textWalletNotConnected = this.page.getByTestId(
      "walletNotConnectedText"
    );
    this.tableCitizens = this.page.getByTestId("citizensTable");
    this.textTotalRecordsCount = this.page.getByTestId("totalRecordsCount");
    this.citizenRows = this.page.locator('[data-testid="citizenRow-1"]');
    this.modal = this.page.locator('div').filter({ hasText: 'Notes: Some of John\'s' }).nth(2);
    this.modalTitle = this.page.getByText('Notes:');
    this.modalText = this.page.getByText('Some of John\'s notes');
    this.closeBtn = this.page.getByRole('button', { name: 'Close' });
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }

  async getWalletNotConnectedText(): Promise<string> {
    const text = (await this.textWalletNotConnected.textContent()) as string;
    return text;
  }

  async getTotalRecordsCount(): Promise<number> {
    const countText = await this.textTotalRecordsCount.textContent();
    const count = Number(countText);
    return count;
  }
}
