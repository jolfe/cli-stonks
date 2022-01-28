#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import axios from "axios";
import moment from "moment";

let nft;
let nftRes;
let apiKey = "T2C5WUK15DAKPCUX";
let baseUrl =
  "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=";
let endUrl = `&to_currency=USD&apikey=${apiKey}`;
const orange = chalk.hex("#FFA500");

const sleep = (ms = 3000) => new Promise((resolve) => setTimeout(resolve, ms));

async function getAll(nftRes) {
  createSpinner().start();
  await sleep(1000);
  createSpinner().stop();
  await nftRes.forEach((el) => {
    axios.get(`${baseUrl}${el}${endUrl}`).then((res) => {
      console.log(res.data);
    });
  });
  await startOver();
}

async function getReq(nftRes) {
  const buffer = chalkAnimation.karaoke(
    `Getting data on NFT: ${chalk.red(nftRes)}`
  );
  await sleep(3000);
  buffer.stop();
  let getUri = `${baseUrl}${nftRes}${endUrl}`;

  console.log(
    orange("Fetching ") +
      chalk.red.bold(nftRes) +
      orange(" data as of ") +
      chalk.black.underline.bgYellow(moment().format("MMMM Do YYYY, h:mm:ss a"))
  );

  await axios
    .get(getUri, {
      headers: { "Content-Type": "application/json", responseType: "json" },
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  await startOver();
}

async function welcome() {
  const createdBy = chalkAnimation.neon("Created by: @jolfe \n");
  await sleep();
  createdBy.stop();
  console.log(`
    ${chalk.green.bold(
      figlet.textSync("Stonks", {
        defaultLayout: "full",
        whitespaceBreak: true,
        width: 90,
      })
    )}`);
}

async function whichData(market) {
  let choice;
  if (market === "Cryptocurrencies") {
    const multipleCheck = await inquirer.prompt({
      type: "confirm",
      name: "multiple_crypto",
      message: "Get data on multiple NFT's?",
    });

    if (multipleCheck.multiple_crypto === true) {
      const buffer = chalkAnimation.karaoke(
        `Getting data on ${chalk.red("multiple")} NFT's`
      );
      await sleep();
      buffer.stop();
      const multiple = await inquirer.prompt({
        type: "checkbox",
        name: "crypto_name",
        message: "Select a cryptocurrency",
        choices: [
          "BTC",
          "ETH",
          "XRP",
          "LTC",
          "BCH",
          "XLM",
          "ADA",
          "XMR",
          "DASH",
        ],
      });
      getAll(multiple.crypto_name);
      nftRes = multiple.crypto_name;
    } else {
      const singular = await inquirer.prompt({
        type: "list",
        name: "crypto_name",
        message: "Select a cryptocurrency",
        choices: [
          "BTC",
          "ETH",
          "XRP",
          "LTC",
          "BCH",
          "XLM",
          "ADA",
          "XMR",
          "DASH",
        ],
      });
      getReq(singular.crypto_name);
      nftRes = singular.crypto_name;
    }
  }
}

async function getAPIKey() {
  const response = await inquirer.prompt({
    type: "input",
    name: "api_key",
    message: "Enter your API key",
  });

  apiKey = response.api_key;
}

async function getMarket() {
  const response = await inquirer.prompt({
    type: "list",
    name: "market_name",
    message: "Select a market",
    choices: ["Stocks, ETFs, and Mutual Funds", "Cryptocurrencies"],
  });

  nft = response.market_name;
}

async function startOver() {
  const response = await inquirer.prompt({
    type: "confirm",
    name: "confirm_name",
    message: "Continue?",
  });

  if (response.confirm_name === true) {
    whichData(nft);
  } else {
    console.log(chalk.red("Exiting..."));
  }
}

await welcome();
await getAPIKey();
await getMarket();
whichData(nft);
