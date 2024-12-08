// Application Run

const app = require("./app");

const port = process.env.PORT || 2024;

app.listen(port, function () {
  console.log(`Listening port ${port}`);
});
