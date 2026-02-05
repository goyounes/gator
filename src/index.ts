import { Config, readConfig, setUser } from "./config";

function main() {
  console.log("Hello, world!");
  setUser("Aron")
  const cfg : Config = readConfig()
  console.log(cfg)
}

main();