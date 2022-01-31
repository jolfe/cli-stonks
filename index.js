#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import axios from "axios";
import moment from "moment";
// import { API_KEY } from "./config/config.js";
import setup from "./config/setup.js";

const setupEnvirontment = async () => {
  try {
    console.log("setup complete");
    await setup();
  } catch {
    console.log(chalk.red("Please run setup.js"));
  }
  // return setup(apiKey);
};

// Todo: restructure to ES6
let nft;
let nftRes;
let apiKey,
  api_key = process.env.API_KEY;
const baseUrl =
  "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=";
const endUrl = `&to_currency=USD&apikey=${apiKey}`;
const orange = chalk.hex("#FFA500");

const sleep = (ms = 3000) => new Promise((resolve) => setTimeout(resolve, ms));

async function getAll(nftRes) {
  await nftRes.forEach((el) => {
    // let arr = [];
    // arr.push(el);
    // Todo: type check array length

    const spinner = createSpinner(`Fetching ${orange(el)}\n`).start();
    setTimeout(() => {
      spinner.success();
    }, 1000);
    axios.get(`${baseUrl}${el}${endUrl}`).then((res) => {
      console.log(res.data);
    });
  });
  try {
    await startOver();
  } catch (err) {
    console.log(err);
  }
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
  const stonks = orange(
    figlet.textSync("stonks", {
      font: "cyberlarge",
      whitespace: false,
      width: 80,
      defaultLayout: "full",
    })
  );
  console.log(stonks);
  const createdBy = orange(
    "Created by " + chalk.bgYellow.white(" @jolfe ") + " on GitHub\n"
  );
  console.log(createdBy);
  const loading = chalkAnimation.pulse(`warming up... \n\n`);
  await sleep();
  loading.stop();
  console.clear();
  console.log();
  console.log(stonks);
  console.log(createdBy);
}

async function whichData(market) {
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
      // ! fetch multiple NFT's from the config.yml file
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
          "NEO",
          "EOS",
          "TRX",
          "ETC",
          "XEM",
          "USDT",
          "XMR",
          "DASH",
          "EOS",
        ],
      });
      getAll(multiple.crypto_name);
      nftRes = multiple.crypto_name;
    } else {
      // ! spaghetti
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
          "NEO",
          "EOS",
          "TRX",
          "ETC",
          "XEM",
          "USDT",
          "XMR",
          "DASH",
          "EOS",
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
    message: `Enter your API key ${chalk.gray(
      "(store in local .env to remember)"
    )}`,
  });
  setupEnvirontment(process.env.API_KEY ?? response.api_key);
  // api_key = process.env.API_KEY;

  // console.log(process.env.API_KEY);
  // if (response.api_key === "" || response.api_key === undefined) {
  //   console.log(chalk.red("Please enter your API key"));
  //   getAPIKey();
  // } else {
  //   return apiKey;
  // }
}

async function getMarket() {
  const response = await inquirer.prompt({
    type: "list",
    name: "market_name",
    message: "Select a market",
    choices: [
      "Stocks, ETFs, and Mutual Funds",
      "Cryptocurrencies",
      "Enter your own Stock Symbol",
      "Forex",
    ],
  });

  if (response.market_name === "Enter your own Stock Symbol") {
    const custom = await inquirer.prompt({
      type: "input",
      name: "custom_name",
      message: "Enter your custom symbol",
    });
    getReq(custom.custom_name);
  }
  return (nft = response.market_name);
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

await setupEnvirontment();
await welcome();
await getAPIKey();
await getMarket();
whichData(nft);
