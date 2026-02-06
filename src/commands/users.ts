import { readConfig, setUser } from "src/config"
import { createUser } from "src/lib/db/queries/users"

export async function handlerLogin(cmdName:string, ...args:string[]): Promise<void>{
    if (args.length !== 1 ) {
        throw new Error ("login function expects <username>")
    }
    const username = args[0]
    setUser(username)
    console.log(`User ${username} has been set`)
    console.log("new config =>", readConfig())
}

export async function handlerRegister(cmdName:string, ...args:string[]): Promise<void>{
    if (args.length !== 1 ) {
        throw new Error ("register function expects <username>")
    }
    const username = args[0]
    try {
        await createUser(username);
        console.log(`User ${username} has been created`)
    } catch (err) {
        throw new Error(`Failed to create user ${username}`);
    }
}