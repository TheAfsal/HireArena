"use server"

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email")
  const password = formData.get("password")

  // Simulate a delay to show loading state
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // This is where you would typically validate credentials against your database
  // For demo purposes, we'll just do basic validation
  if (!email || !password) {
    return {
      error: "Please provide both email and password",
    }
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return {
      error: "Please provide a valid email address",
    }
  }

  // Return success response
  return {
    success: true,
  }
}

