import type { PageOptions } from "../core/page-option.js";
import type { iFriend } from "../models/friend.model.js";

export class FriendRepository {
  private static instance: FriendRepository;
  private friends: iFriend[] = [];

  static getInstance() {
    if (!FriendRepository.instance) {
      FriendRepository.instance = new FriendRepository();
    }
    return FriendRepository.instance;
  }

  private constructor() {}

  addFriend(friend: iFriend) {
    if (this.findFriendByEmail(friend.email)) {
      console.log("Duplicate email detected in repository");
      return null;
    }

    if (this.findFriendByPhone(friend.phone)) {
      console.log("Duplicate phone detected in repository");
      return null;
    }

    this.friends.push(friend);
    console.log("Friend added to repository:", friend);
    return friend;
  }

  findFriendByEmail(email: string) {
    return this.friends.find((friend) => friend.email === email);
  }

  findFriendByPhone(phone: string) {
    return this.friends.find((friend) => friend.phone === phone);
  }

  searchFriends(query: string, pageOption?: PageOptions) {
    const lowerQuery = query.toLowerCase();

    const filtered = this.friends.filter((friend) => {
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
      total: this.friends.length,
    };
  }

  removeFriend(identifier: string) {
    const index = this.friends.findIndex(
      (friend) => friend.email === identifier || friend.phone === identifier,
    );

    if (index > -1) {
      const removed = this.friends[index];
      this.friends.splice(index, 1);
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
    const index = this.friends.findIndex(
      (friend) => friend.email === identifier || friend.phone === identifier,
    );

    if (index === -1) {
      return null;
    }

    const friendToUpdate = this.friends[index];
    if (!friendToUpdate) {
      return null;
    }

    if (
      updates.email &&
      this.friends.some(
        (f) => f.email === updates.email && f.id !== friendToUpdate.id,
      )
    ) {
      console.log("Duplicate email detected during update");
      return null;
    }

    if (
      updates.phone &&
      this.friends.some(
        (f) => f.phone === updates.phone && f.id !== friendToUpdate.id,
      )
    ) {
      console.log("Duplicate phone detected during update");
      return null;
    }

    if (updates.name !== undefined) friendToUpdate.name = updates.name;
    if (updates.email !== undefined) friendToUpdate.email = updates.email;
    if (updates.phone !== undefined) friendToUpdate.phone = updates.phone;
    if (updates.balance !== undefined) friendToUpdate.balance = String(updates.balance);

    console.log("Friend updated in repository:", friendToUpdate);
    return friendToUpdate;
  }
  getAllFriends() {
    return [...this.friends];
  }
}
