import type { iFriend } from "../models/friend.model.js";
import { FriendRepository } from "../repositories/friends.repository.js";

export class FriendsController {
  checkEmailExists(email: string) {
    const repository = FriendRepository.getInstance();
    if (!repository) return false;
    return !!repository.findFriendByEmail(email);
  }
  checkPhoneExists(phone: string) {
    const repository = FriendRepository.getInstance();
    if (!repository) return false;
    return !!repository.findFriendByPhone(phone);
  }
  addFriend(friend: iFriend) {
    const repository = FriendRepository.getInstance();

    if (!repository) {
      return { success: false, message: "Repository not available" };
    }

    const emailExists = repository.findFriendByEmail(friend.email);
    const phoneExists = repository.findFriendByPhone(friend.phone);

    if (emailExists && phoneExists) {
      return {
        success: false,
        message: "Email and phone number already exist",
      };
    }
    if (emailExists) {
      return { success: false, message: "Email already exists" };
    }
    if (phoneExists) {
      return { success: false, message: "Phone number already exists" };
    }
    // console.log("Adding friend to database...", friend);
    repository.addFriend(friend);

    return { success: true, message: "Friend added successfully" };
  }
  searchFriends(query: string) {
    const repository = FriendRepository.getInstance();

    if (!repository) {
      return { success: false, data: [] };
    }

    if (!query.trim()) {
      const allFriends =
        typeof repository.getAllFriends === "function"
          ? repository.getAllFriends()
          : repository.searchFriends("").data;

      return {
        success: true,
        data: allFriends,
        total: allFriends.length,
      };
    }

    const result = repository.searchFriends(query);

    return {
      success: true,
      data: result.data,
      total: result.matched,
    };
  }
  updateFriend(
    identifier: string,
    updates: {
      name?: string;
      email?: string;
      phone?: string;
      balance?: number;
    },
  ) {
    const repository = FriendRepository.getInstance();
    if (!repository) {
      return { success: false, message: "Repository not available" };
    }
    const updatedFriend = repository.updateFriend(identifier, updates);
    if (!updatedFriend) {
      return {
        success: false,
        message: "Friend not found with this email or phone",
      };
    }
    return {
      success: true,
      message: "Friend updated successfully",
      data: updatedFriend,
    };
  }
  removeFriend(identifier: string) {
    const repository = FriendRepository.getInstance();

    if (!repository) {
      return { success: false, message: "Repository not available" };
    }

    const removedFriend = repository.removeFriend(identifier);

    if (!removedFriend) {
      return {
        success: false,
        message: "Friend not found with this email or phone",
      };
    }

    return {
      success: true,
      message: "Friend removed successfully",
      data: removedFriend,
    };
  }
}
