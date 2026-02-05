import fs from "fs";
import os from "os";
import path from "path";
export type Config = {
  "dbUrl": string,
  "currentUserName": string
}

function writeConfig(cfg: Config): void {
    try {
        const configPath = getConfigFilePath()
        const rawConfig = {
            current_user_name : cfg.currentUserName,
            db_url : cfg.dbUrl
        }
        fs.writeFileSync(configPath,JSON.stringify(rawConfig));
        console.log('File written successfully');
    } catch (err) {
        console.error('Error writing file:', err);
    }
    return   
}


export function setUser(user: string ){
    try {
        const cfg : Config = readConfig()
        cfg.currentUserName = user
        writeConfig(cfg)
    } catch (err) {
        console.log((err as Error).message)
    }

    return
}
export function readConfig(): Config{
    const configPath  = getConfigFilePath()
    const json = fs.readFileSync(configPath,'utf8')
    const cfg = validateConfig(JSON.parse(json))
    return cfg
}

function validateConfig(rawConfig: any): Config{
    if( rawConfig?.db_url === undefined || typeof (rawConfig?.db_url) !== "string"){
        throw new Error("db url is required")
    }
    if( rawConfig?.current_user_name === undefined || typeof (rawConfig?.current_user_name) !== "string"){
        return {
            dbUrl: rawConfig.db_url,
            currentUserName: ""
        }
    }
    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name
    }
}
function getConfigFilePath(): string{
    return path.join(os.homedir(),".gatorconfig.json")
}