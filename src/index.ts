import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerLogin } from "./commands/users";
// import { Config, readConfig, setUser } from "./config";

function main() {
    console.log("Hello, world!");
    const commandsRegistry: CommandsRegistry = {}
    registerCommand(commandsRegistry, "login", handlerLogin);
    console.log(commandsRegistry)

    try {
        if (process.argv.length === 2) {
            throw new Error("Not enough arguments were provided")
        }
        const [ , ,cmdName, ...args] = process.argv 
        runCommand(commandsRegistry,cmdName,...args)
    } catch (err) {
        console.log((err as Error).message)
        process.exit(1)
    }
}

main();