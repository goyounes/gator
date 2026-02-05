import { readConfig, setUser } from "src/config";

export type CommandHandler  = (cmdName: string, ...args: string[]) => void

export type CommandsRegistry = Record<string,CommandHandler>

export function handlerLogin(cmdName:string, ...args:string[]):void{
    if (args.length !== 1 ) {
        throw new Error ("login function expects <username>")
    }
    const username = args[0]
    setUser(username)
    console.log(`User ${username} has been set`)
    console.log("new config =>", readConfig())
}
export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler):void{
    registry[cmdName] = handler
}
export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]):void{
    const callback = registry[cmdName]
    callback(cmdName,...args)
}