import { CommandHandler, UserCommandHandler } from "src/commands/commands";
import { getUserByName } from "./lib/db/queries/usersQueries";
import { User } from "./lib/db/schema";
import { Config, readConfig } from "./config";



export type MiddlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler{
    return async (cmdName: string, ...args: string[]) => {
        const cfg: Config = readConfig() 
        if (! cfg.currentUserName){
            throw new Error(`User not logged in`);
        }
        const user: User = await getUserByName(cfg.currentUserName)
        if (!user) {
            throw new Error(`User ${cfg.currentUserName} not found`);
        }
        await handler(cmdName, user, ...args);
    }
}