const setup = async () => {
  const apiKey = process.env.API_KEY || "Change me";
  if (!apiKey) {
    console.log(chalk.red("You must enter an API key."));
    process.exit(1);
  } else {
    return apiKey;
  }
};

export default setup;
