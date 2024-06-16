export function calculatePasswordStrength(
  password: string
): "weak" | "medium" | "strong" {
  if (password.length < 8) return "weak";

  const hasNumber = /\d/.test(password);
  const hasCapital = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  if (password.length >= 16 && hasNumber && hasCapital && hasLowercase)
    return "strong";

  if (password.length >= 8) return "medium";

  return "weak";
}
