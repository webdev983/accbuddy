import gulp from "gulp";
import fetch from "node-fetch";
import { promises as fs } from "fs";
import replace from "gulp-replace";
//
//@ Some Constants
const baseURL = "https://api.accbuddy.com/public";

/* List of all the product Id */
const productIDs = [
  "c77a805f-9f42-4793-a015-17183fd65532",
  "f8d81fa1-8f8c-4120-87cc-2f1ee8f0533d",
  "b1a3b146-5421-4d89-b350-bc1f36dff065",
  "48d27c03-317d-40b5-9a93-0d87bacdc496",
  "7ba74e4e-a13d-4450-a846-92b6b3c0e8db",
  "07cf61ac-3a5f-4861-ad22-0c3e1ef4aa6b",
  "65c9b7be-22ea-4792-a772-63bad678cf35",
];

/* A list of paths to all the files that will be modified  */
const basePath = "src/html/partials/catalog/";

const relPath2Files = {
  allALBody: "_all-accoun-list/_all-accoun-list-body.html",
  cBABody: "_category-base-accounts/_category-base-accounts-body.html",
  aTTSBody: "_account-types-tabs/_account-types-tabs-source-body.html",
  aTTSInput: "_account-types-tabs/_account-types-tabs-source-input.html",
  cAndALInput: "categor-and-all-accounts-input/_all-accoun-list-input.html",
};

// const allAcc

/* Setup this symbols for intellisense population to minimize misspelling errors */
const IProductResponse = {
  pAttr2: "productAttr2",
  pStatus: "productStatus",
  pAttr1: "productAttr1",
  pUpdateTsp: "productUpdateTimestamp",
  pWarning: "productWarning",
  pQty: "productQty",
  pDescr: "productDescr",
  pCatalogueTsp: "productCatalogUpdateTimestamp",
  pk: "PK",
  pPrice: "productPrice",
  pDiscountPrice: "productDiscountPrice",
  pName: "productName",
};

/* A function that calls the api and return the result of the POST request*/
async function fetchData(productID) {
  try {
    //data in the body of the POST request
    const data = JSON.stringify({
      fetchProductByID: {
        productID,
      },
    });

    //@ initial options for the fetch API
    const options = {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await fetch(baseURL, options);
    return res.json();
  } catch (error) {
    console.error("Error fetching data from Api");
  }
}

/* fetches and saves the file to a json file */
async function func1() {
  const productData = [];
  for (let productID of productIDs) {
    const data = await fetchData(productID);
    // @ Populate the template files with the original details

    productData.push(data.result);
  }
  await fs.writeFile("productData.json", JSON.stringify(productData));
}

/* Second Function that insert the input template into the body template*/
async function func2() {
  const baseOutputPath = "build/";
  try {
    const data = await fs.readFile("productData.json", { encoding: "utf-8" });

    const productData = JSON.parse(data);
    let template1 = "",
      template2 = "";

    for (let product of productData) {
      // for the Account types tabs file
      const text1 = await fs.readFile(basePath + relPath2Files.aTTSInput, {
        encoding: "utf-8",
      });

      const newText1 = text1.replace(
        IProductResponse.pAttr1,
        product[IProductResponse.pAttr1]
      );
      template1 = template1.concat(newText1);

      // for the Account types tabs file
      const text2 = await fs.readFile(basePath + relPath2Files.cAndALInput, {
        encoding: "utf-8",
      });

      // for the category base account files body and all account files file
      const newText2 = text2
        .replace(/\|productName\|/g, product[IProductResponse.pName])
        .replace("|productPrice|", product[IProductResponse.pPrice])
        .replace(/\|productQty\|/g, product[IProductResponse.pQty])
        .replace("|productDescription|", product[IProductResponse.pQty])
        .replace("|productImageUrl|", product[IProductResponse.pName])
        .replace("|productImageText|", product[IProductResponse.pName]);
      template2 = template2.concat(newText2);
    }
    // for the Account types tabs file
    gulp
      .src(basePath + relPath2Files.aTTSBody)
      .pipe(replace("|productAttr1|", template1))
      .pipe(gulp.dest(baseOutputPath));

    // for the Account types tabs file
    gulp
      .src(basePath + relPath2Files.cBABody)
      .pipe(replace("|product|", template2))
      .pipe(gulp.dest(baseOutputPath));

    // for the Account types tabs file
    gulp
      .src(basePath + relPath2Files.allALBody)
      .pipe(replace("|product|", template2))
      .pipe(gulp.dest(baseOutputPath));
  } catch (error) {
    console.error("Oops", error);
  }
}

gulp.task("build", async function () {
  console.log("gulp build started");
  await func1();
  await func2();
  console.log("done");
});
