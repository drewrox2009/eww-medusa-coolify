import { medusa } from "./client";

// Note: These are placeholder implementations
// Medusa auth API methods may vary by version
// We'll implement these properly once we verify the correct API

export async function login(email: string, password: string) {
  try {
    // Placeholder - replace with correct Medusa auth method
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function register(data: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}) {
  try {
    // Placeholder - replace with correct Medusa auth method
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function logout() {
  try {
    // Clear local storage/session
    localStorage.removeItem("pharma-user-storage");
    localStorage.removeItem("pharma-cart-storage");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    // Placeholder - replace with correct Medusa auth method
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/auth`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Not authenticated");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
}

export async function resetPassword(email: string) {
  try {
    // Placeholder - replace with correct Medusa auth method
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/password-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Password reset failed");
    }

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
}

export async function updatePassword(token: string, password: string) {
  try {
    // Placeholder - replace with correct Medusa auth method
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/password-reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Password update failed");
    }

    return { success: true };
  } catch (error) {
    console.error("Password update error:", error);
    throw error;
  }
}
