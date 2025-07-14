
"use server";

import { revalidatePath } from "next/cache";
import { users } from "@/lib/data";
import type { User } from "@/lib/types";

// In a real application, these functions would interact with a database.
// Here, we are just modifying an in-memory array.

export async function addUser(userData: Omit<User, 'id'>) {
  try {
    const newUser: User = {
      id: (Math.random() * 10000).toString(), // Simulate a new ID
      ...userData,
    };
    users.push(newUser);
    revalidatePath("/admin/users"); // Invalidate cache to show new user
    return { success: true, message: "User added successfully." };
  } catch (error) {
    return { success: false, message: "Failed to add user." };
  }
}

export async function updateUser(userId: string, userData: Partial<Omit<User, 'id'>>) {
  try {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }
    
    // Create a new user object with updated data
    const updatedUser = { ...users[userIndex], ...userData };

    // If password is an empty string, it means we don't want to update it.
    // In this simulation, we'll keep the old one. A real DB would handle this better.
    if (userData.password === "") {
      updatedUser.password = users[userIndex].password;
    }

    users[userIndex] = updatedUser;
    
    revalidatePath("/admin/users");
    return { success: true, message: "User updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update user." };
  }
}

export async function deleteUser(userId: string) {
  try {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }
    users.splice(userIndex, 1);
    revalidatePath("/admin/users");
    return { success: true, message: "User deleted successfully." };
  } catch (error) {
    return { success: false, message: "Failed to delete user." };
  }
}
