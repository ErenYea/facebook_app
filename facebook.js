const puppeteer = require("puppeteer");

async function main() {
  // Add code here
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
  );
  await page.goto("https://www.facebook.com/lorealparisthailand/shop/", {
    waitUntil: "load",
  });
  await page.waitForXPath(
    `//div[@role="banner"]/../div[contains(@class,'x9f619')]/div/div/div/div/div/div/div/div/div[last()]/div/div/div/div/div/div/div[2]/div/div/div`,
    { timeout: 30000 }
  );
  console.log("helloi");
  const count = await page.evaluate(async () => {
    var xpath = function (xpathToExecute) {
      var result = [];
      var nodesSnapshot = document.evaluate(
        xpathToExecute,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
        result.push(nodesSnapshot.snapshotItem(i));
      }
      return result;
    };

    var count = xpath(
      `//div[@role="banner"]/../div[contains(@class,'x9f619')]/div/div/div/div/div/div/div/div/div[last()]/div/div/div/div/div/div/div[2]/div/div/div`
    ).length;
    console.log(count);
    var i = 2000;
    while (true) {
      window.scrollBy(0, i);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      var currentcount = xpath(
        `//div[@role="banner"]/../div[contains(@class,'x9f619')]/div/div/div/div/div/div/div/div/div[last()]/div/div/div/div/div/div/div[2]/div/div/div`
      ).length;
      if (currentcount == count) {
        break;
      } else {
        count = currentcount;
      }
      i += 2000;
    }
    return count;
  });
  const json_data = {};
  for (let i = 1; i <= count; i++) {
    var [url, title, price, img] = await page.evaluate((i) => {
      function getElementByXpath(path) {
        return document.evaluate(
          path,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
      }
      var element =
        getElementByXpath(`//div[@role="banner"]/../div[contains(@class,'x9f619')]/div/div/div/div/div/div/
      div/div/div[last()]/div/div/div/div/div/div/div[2]/div/div/div[${i}]//a`);
      try {
        var price = getElementByXpath(
          `//div[@role="banner"]/../div[contains(@class,'x9f619')]/div/div/div/div/div/div/div/div/div[last()]/div/div/div/div/div/div/div[2]/div/div/div[${i}]//a/div/div[2]/div[2]`
        ).textContent;
        var img = getElementByXpath(
          `//div[@role="banner"]/../div[contains(@class,'x9f619')]/div/div/div/div/div/div/div/div/div[last()]/div/div/div/div/div/div/div[2]/div/div/div[${i}]//img`
        ).src;
        return [element.href, element.getAttribute("aria-label"), price, img];
      } catch {
        return [false, false, false, false];
      }
    }, i);
    if (url == false) {
      break;
    }
    // console.log(price);
    json_data[title] = {
      url,
      price,
      img,
    };
  }
  // console.log(json_data);
  return json_data;
  //   await page.evaluate(() => {
  //     var xpath = function (xpathToExecute) {
  //       var result = [];
  //       var nodesSnapshot = document.evaluate(
  //         xpathToExecute,
  //         document,
  //         null,
  //         XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
  //         null
  //       );
  //       for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
  //         result.push(nodesSnapshot.snapshotItem(i));
  //       }
  //       return result;
  //     };

  //     const all_products = xpath(
  //       `//div[@role="banner"]/../div[contains(@class,'x9f619')]/div/div/div/div/div/div/div/div/div[last()]/div/div/div/div/div/div/div[2]/div/div/div`
  //     );
  //   });
  //   await browser.close();
}
module.exports = main;
