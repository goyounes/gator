import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands/usersCommands";
import { handlerAgg, handlerAddFeed, handlerFeeds} from "./commands/rssCommands";
import { handlerFollow, handlerFollowing, handlerUnfollow } from "./commands/followCommands";
import { middlewareLoggedIn } from "./middleware"
async function main() {
    if (process.argv.length <= 2) {
        console.log("Not enough arguments were provided")
        process.exit(1)
    }

    const commandsRegistry: CommandsRegistry = {}
    registerCommand(commandsRegistry, "login", handlerLogin);
    registerCommand(commandsRegistry, "register", handlerRegister);
    registerCommand(commandsRegistry, "reset", handlerReset);
    registerCommand(commandsRegistry, "users", handlerUsers);
    registerCommand(commandsRegistry, "agg", handlerAgg);
    registerCommand(commandsRegistry, "feeds", handlerFeeds);
    registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(commandsRegistry, "follow", middlewareLoggedIn(handlerFollow));
    registerCommand(commandsRegistry, "following", middlewareLoggedIn(handlerFollowing));
    registerCommand(commandsRegistry, "unfollow", middlewareLoggedIn(handlerUnfollow));

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