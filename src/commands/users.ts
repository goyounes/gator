import { readConfig, setUser } from "src/config"

export async function handlerLogin(cmdName:string, ...args:string[]): Promise<void>{
    if (args.length !== 1 ) {
        throw new Error ("login function expects <username>")
    }
    const username = args[0]
    setUser(username)
    console.log(`User ${username} has been set`)
    console.log("new config =>", readConfig())
}