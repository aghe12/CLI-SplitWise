import { FriendsController } from "../controller/friends.controller.js";
import { emailValidator } from "../core/validators/email.validator.js";
import { numberValidator } from "../core/validators/number.validator.js";
import { phoneValidator } from "../core/validators/phone.validator.js";
import { openInteractionManager, type Choice } from "./interaction-manager.js";

const options: Choice[] = [
  { label: "Add Friend", value: "1" },
  { label: "Search Friend", value: "2" },
  { label: "Update Friend", value: "3" },
  { label: "Remove Friend", value: "4" },
  { label: "Exit", value: "5" },
];

const { ask, choose, close } = openInteractionManager();

const addFriend = async () => {
  const name = await ask("Enter friend name:");
  const email = await ask("Enter friend email:", {
    validator: emailValidator,
  });
  const phone = await ask("Enter friend phone number:", {
    validator: phoneValidator,
  });
  const openingBalance = await ask(
    "Enter opening balance (positive mean they owe you, negative means you owe them):",
    { validator: numberValidator },
  );

  const friend = {
    id: Date.now().toString(),
    name: name || "",
    email: email || "",
    phone: phone || "",
    balance: openingBalance || "0",
  };

  const controller = new FriendsController();
  const result = controller.addFriend(friend);
  console.log(result?.message || "Failed to add friend");
};

const searchFriend = async () => {
  const query =
    (await ask("Enter search term (name, email, or phone):"))?.trim() ?? "";

  const controller = new FriendsController();
  const result = controller.searchFriends(query);

  if (result.success && result.data.length > 0) {
    console.log(`\nFound ${result.total} friend(s):`);

    console.table(
      result.data.map((friend) => ({
        Name: friend.name,
        Email: friend.email,
        Phone: friend.phone,
        Balance: friend.balance,
      })),
    );
  } else {
    console.log("No friends found matching your search.");
  }
};

const removeFriend = async () => {
  const identifier = await ask("Enter friend email or phone number to remove:");

  const controller = new FriendsController();

  const searchResult = controller.searchFriends(identifier || "");

  if (!searchResult.success || searchResult.data.length === 0) {
    console.log("Friend not found");
    return;
  }

  const friend = searchResult.data[0]!;

  if (Number(friend.balance) !== 0) {
    console.log(`!!This friend has a balance: $${friend.balance}!!`);

    const confirm = await choose("Do you want to continue?", [
      { label: "YES", value: "1" },
      { label: "NO", value: "2" },
    ]);

    if (confirm?.value !== "1") {
      console.log("Removal cancelled");
      return;
    }
  }

  const result = controller.removeFriend(identifier || "");

  if (result.success) {
    console.log(result.message);
    console.log(
      `Removed: ${result.data?.name} (${result.data?.email}, ${result.data?.phone})`,
    );
  } else {
    console.log(result.message);
  }
};

const updateFriend = async () => {
  const identifier = await ask("Enter friend email or phone number to update:");

  const controller = new FriendsController();
  const findResult = controller.searchFriends(identifier || "");

  if (!findResult.success || findResult.data.length === 0) {
    console.log("Friend not found with this email or phone");
    return;
  }

  const friend = findResult.data[0]!;

  console.log(`\nCurrent friend info:`);
  console.table([
    {
      Name: friend.name,
      Email: friend.email,
      Phone: friend.phone,
      Balance: friend.balance,
    },
  ]);

  console.log("\nWhat do you want to update?");
  console.log("1. Name");
  console.log("2. Email");
  console.log("3. Phone");
  console.log("4. Balance");
  console.log("5. Cancel");

  const fieldChoice = await ask("Enter your choice (1-5):");

  if (fieldChoice === "5") {
    console.log("Update cancelled");
    return;
  }

  let updates: any = {};

  switch (fieldChoice) {
    case "1":
      updates.name = await ask("Enter new name:");
      break;
    case "2":
      updates.email = await ask("Enter new email:", {
        validator: emailValidator,
      });
      break;
    case "3":
      updates.phone = await ask("Enter new phone number:", {
        validator: phoneValidator,
      });
      break;
    case "4":
      const balanceInput = await ask("Enter new balance:", {
        validator: numberValidator,
      });
      updates.balance = Number(balanceInput);
      break;
    default:
      console.log("Invalid choice");
      return;
  }

  const updateResult = controller.updateFriend(identifier || "", updates);

  if (updateResult.success) {
    console.log("Friend updated successfully!");
    console.table([
      {
        Name: updateResult.data?.name,
        Email: updateResult.data?.email,
        Phone: updateResult.data?.phone,
        Balance: updateResult.data?.balance,
      },
    ]);
  } else {
    console.log(updateResult.message);
  }
};

export const manageFriends = async () => {
  while (true) {
    const choice = await choose("What do you want to do?", options, false);

    switch (choice!.value) {
      case "1":
        await addFriend();
        break;
      case "2":
        await searchFriend();
        break;
      case "3":
        await updateFriend();
        break;
      case "4":
        await removeFriend();
        break;
      case "5":
        console.log("Exiting...");
        close();
        return;
    }
  }
};
