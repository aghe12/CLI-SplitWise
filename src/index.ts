import { openInteractionManager } from "./presentation/interaction-manager.js"
import { manageFriends } from "./presentation/friends-manager.js"

 const run = async ()=>{
    const {close,choose,ask} = openInteractionManager();
    await manageFriends();
}

run().catch(console.error);