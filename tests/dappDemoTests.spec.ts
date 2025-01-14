import { test, expect } from "../fixtures/pomSynpressFixture";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { citizenData, expectedValues } from "../testData/dappDemoTestsData";
import AddCitizenPage from "../pages/addCitizen.page";

test.describe("Dapp Demo Tests", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.connectWallet();
  });

  test("Connecting Wallet to the application is successful", async ({
    homePage,
  }) => {
    const connectedWalletAddress = await homePage.getConnectedWalletAddress();
    const connectedAddressMetamask = await metamask.getWalletAddress();
    expect(connectedAddressMetamask).toEqual(connectedWalletAddress);
    await expect(homePage.btnConnect).not.toBeVisible();
    await expect(homePage.textWalletNotConnected).not.toBeVisible();
    await expect(homePage.btnAddCitizenHeader).toBeVisible();
    expect(await homePage.getAddCitizenHeaderButtonText()).toEqual(
      expectedValues.addCitizenButtonTextExpected
    );
    expect(await homePage.getTotalRecordsCount()).not.toEqual(0);
    await expect(homePage.tableCitizens).toBeVisible();
  });

  test("Disconnecting Wallet from the application is successful", async ({
    homePage,
  }) => {
    await metamask.disconnectWalletFromDapp();
    await expect(homePage.btnAddCitizenHeader).not.toBeVisible();
    await expect(homePage.tableCitizens).not.toBeVisible();
    await expect(homePage.btnConnect).toBeVisible();
    expect(await homePage.getConnectButtonText()).toEqual(
      expectedValues.connectButtonTextExpected
    );
    expect(await homePage.getTotalRecordsCount()).toEqual(0);
    await expect(homePage.textWalletNotConnected).toBeVisible();
    expect(await homePage.getWalletNotConnectedText()).toEqual(
      expectedValues.walletNotConnectedTextExpected
    );
  });

  test("Adding new citizen is successful", async ({
    homePage,
    addCitizenPage,
  }) => {
    const totalCountBefore = await homePage.getTotalRecordsCount();
    await homePage.btnAddCitizenHeader.click();
    await addCitizenPage.addCitizen(citizenData);
    await expect(addCitizenPage.msgCitizenAddedSuccess).toBeVisible({
      timeout: 60000,
    });
    await homePage.navigate();
    await homePage.page.waitForSelector("[data-testid='citizenRow-1']");
    const totalCountAfter = await homePage.getTotalRecordsCount();
    expect(totalCountAfter).toBeGreaterThan(totalCountBefore);
  });

  test("Error messages for blank fields", async ({
    homePage,
    addCitizenPage,
  }) => {
    const totalCountBefore = await homePage.getTotalRecordsCount();
    await homePage.btnAddCitizenHeader.click();
    await addCitizenPage.btnAdd.click();
    await addCitizenPage.page.waitForSelector(".text-red-500", { state: "visible", timeout: 5000 });
    await expect(addCitizenPage.errMessage.nth(0)).toBeVisible({ timeout: 5000 });
    await expect(addCitizenPage.errMessage.nth(0)).toHaveText("This field is required");
    await expect(addCitizenPage.errMessage.nth(1)).toHaveText("This field is required");
    await expect(addCitizenPage.errMessage.nth(2)).toHaveText("This field is required");
    await expect(addCitizenPage.errMessage.nth(3)).toHaveText("This field is required");
  });

  test("First Citizen's detail page", async ({
    homePage,
  }) => {
    await homePage.tableCitizens.waitFor({ state: "visible", timeout: 10000 });
    await homePage.citizenRows.waitFor({ state: "visible", timeout: 5000 });
    await homePage.citizenRows.click();
    await homePage.modal.waitFor({ state: "visible", timeout: 5000 });
    await expect(homePage.modalTitle).not.toHaveText("");
    await expect(homePage.modalText).not.toHaveText("");
    await homePage.closeBtn.waitFor({ state: "visible", timeout: 10000 });
    await homePage.closeBtn.click();
    await expect(homePage.tableCitizens).toBeVisible();
  });
});

