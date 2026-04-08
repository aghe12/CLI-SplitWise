import type { PageOptions } from "../core/page-option.js";
import type { iFriend } from "../models/friend.model.js";
import { AppDBManager } from "../models/db-manager.js";

export class FriendRepository {
  private static instance: FriendRepository;
  private dbManager: AppDBManager;

  static getInstance() {
    if (!FriendRepository.instance) {
      FriendRepository.instance = new FriendRepository();
    }
    return FriendRepository.instance;
  }

  private constructor() {
    this.dbManager = AppDBManager.getInstance();
  }

  addFriend(friend: iFriend) {
    if (this.findFriendByEmail(friend.email)) {
      console.log("Duplicate email detected in repository");
      return null;
    }

    if (this.findFriendByPhone(friend.phone)) {
      console.log("Duplicate phone detected in repository");
      return null;
    }

    const friendsTable = this.dbManager.getDB().table('friends') as iFriend[];
    friendsTable.push(friend);
    this.dbManager.save();
    console.log("Friend added to repository:", friend);
    return friend;
  }

  findFriendByEmail(email: string) {
    const friendsTable = this.dbManager.getDB().table('friends') as iFriend[];
    return friendsTable.find((friend: iFriend) => friend.email === email);
  }

  findFriendByPhone(phone: string) {
    const friendsTable = this.dbManager.getDB().table('friends') as iFriend[];
    return friendsTable.find((friend: iFriend) => friend.phone === phone);
  }

  searchFriends(query: string, pageOption?: PageOptions) {
    const lowerQuery = query.toLowerCase();
    const friendsTable = this.dbManager.getDB().table('friends') as iFriend[];

    const filtered = friendsTable.filter((friend: iFriend) => {
      return (
        friend.name.toLowerCase().includes(lowerQuery) ||
        friend.email.toLowerCase().includes(lowerQuery) ||
        friend.phone.toLowerCase().includes(lowerQuery)
      );
    });

    return {
      data: filtered.slice(
        pageOption?.offset || 0,
        (pageOption?.offset || 0) + (pageOption?.limit || 5),
      ),
      matched: filtered.length,
      total: friendsTable.length,
    };
  }

  removeFriend(identifier: string) {
    const friendsTable = this.dbManager.getDB().table('friends') as iFriend[];
    const index = friendsTable.findIndex(
      (friend: iFriend) => friend.email === identifier || friend.phone === identifier,
    );

    if (index > -1) {
      const removed = friendsTable[index];
      friendsTable.splice(index, 1);
      this.dbManager.save();
      console.log("Friend removed from repository:", removed);
      return removed;
    }

    return null;
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
    const friendsTable = this.dbManager.getDB().table('friends') as iFriend[];
    const index = friendsTable.findIndex(
      (friend: iFriend) => friend.email === identifier || friend.phone === identifier,
    );

    if (index === -1) {
      return null;
    }

    const friendToUpdate = friendsTable[index];
    if (!friendToUpdate) {
      return null;
    }

    if (
      updates.email &&
      friendsTable.some(
        (f: iFriend) => f.email === updates.email && f.id !== friendToUpdate.id,
      )
    ) {
      console.log("Duplicate email detected during update");
      return null;
    }

    if (
      updates.phone &&
      friendsTable.some(
        (f: iFriend) => f.phone === updates.phone && f.id !== friendToUpdate.id,
      )
    ) {
      console.log("Duplicate phone detected during update");
      return null;
    }

    if (updates.name !== undefined) friendToUpdate.name = updates.name;
    if (updates.email !== undefined) friendToUpdate.email = updates.email;
    if (updates.phone !== undefined) friendToUpdate.phone = updates.phone;
    if (updates.balance !== undefined) friendToUpdate.balance = String(updates.balance);

    this.dbManager.save();
    console.log("Friend updated in repository:", friendToUpdate);
    return friendToUpdate;
  }
  getAllFriends() {
    const friendsTable = this.dbManager.getDB().table('friends') as iFriend[];
    return [...friendsTable];
  }
}
