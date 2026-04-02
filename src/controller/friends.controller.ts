import type { iFriend } from "../models/friend.model.js";
import { FriendRepository } from "../repositories/friends.repository.js";

export class FriendsController{
    checkEmailExists(email:string){
        return false;
    }
    checkPhoneExists(phone:string){
        return false;
    }
    addFriend(friend:iFriend){
        if(!FriendRepository.getInstance()){
            return {success:false}
        }
        console.log('Adding friend to database...',friend)
        FriendRepository.getInstance().addFriend(friend);
    }
    searchFriends(query:string){
    const repository = FriendRepository.getInstance();
    
    if(!repository){
        return {success:false, data:[]}
    }
    
    const result = repository.searchFriends(query);
    
    return {
        success:true,
        data:result.data,
        total:result.matched
    };
}
    updateFriend(identifier:string, updates:{name?:string, email?:string, phone?:string, balance?:number}){
    const repository = FriendRepository.getInstance();
    if(!repository){
        return {success:false, message:'Repository not available'}
    }
    const updatedFriend = repository.updateFriend(identifier, updates);
    if(!updatedFriend){
        return {success:false, message:'Friend not found with this email or phone'}
    }
    return {success:true, message:'Friend updated successfully', data:updatedFriend}
}
    removeFriend(identifier:string){
    const repository = FriendRepository.getInstance();
    
    if(!repository){
        return {success:false, message:'Repository not available'}
    }
    
    const removedFriend = repository.removeFriend(identifier);
    
    if(!removedFriend){
        return {success:false, message:'Friend not found with this email or phone'}
    }
    
    return {success:true, message:'Friend removed successfully', data:removedFriend}
}
}