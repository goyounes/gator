import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands/usersCommands";
import { handlerAgg, handlerAddFeed, handlerFeeds} from "./commands/rssCommands";
import { handlerFollow, handlerFollowing } from "./commands/followCommands";

async function main() {
    if (process.argv.length <= 2) {
        throw new Error("Not enough arguments were provided")
    }

    const commandsRegistry: CommandsRegistry = {}
    registerCommand(commandsRegistry, "login", handlerLogin);
    registerCommand(commandsRegistry, "register", handlerRegister);
    registerCommand(commandsRegistry, "reset", handlerReset);
    registerCommand(commandsRegistry, "users", handlerUsers);
    registerCommand(commandsRegistry, "agg", handlerAgg);
    registerCommand(commandsRegistry, "addfeed", handlerAddFeed);
    registerCommand(commandsRegistry, "feeds", handlerFeeds);
    registerCommand(commandsRegistry, "follow", handlerFollow);
    registerCommand(commandsRegistry, "following", handlerFollowing);

    const [cmdName, ...cmdArgs] = process.argv.slice(2)

    try {
        await runCommand(commandsRegistry, cmdName, ...cmdArgs)
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error running command ${cmdName}: ${err.message}`);
        } else {
            console.error(`Error running command ${cmdName}: ${err}`);
        }
        process.exit(1)
    }
    process.exit(0)
}

await main();