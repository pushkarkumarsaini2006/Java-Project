import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Library, Leaf, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: name, name, email, password }),
      });

      if (response.ok) {
        setSuccess("Registration successful! Logging you in...");
        
        // Auto-login the user with the registered credentials
        const loginSuccess = await login(email, password);
        if (loginSuccess) {
          // Navigation will be handled by the AuthContext based on user role
        } else {
          setError("Registration successful but auto-login failed. Please try logging in manually.");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else {
        const data = await response.json();
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white">
            <div className="relative">
              <Library className="size-6" />
              <Leaf className="absolute -top-1 -right-1 size-3 text-emerald-200" />
            </div>
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <UserPlus className="size-5" />
            Join LeafStack Library
          </CardTitle>
          <CardDescription>Create your library account to start borrowing books</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-emerald-200 bg-emerald-50">
                <AlertDescription className="text-emerald-700">{success}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
          
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-center text-muted-foreground">
              By registering, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}