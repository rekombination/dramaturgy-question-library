"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  emailVerified: Date | null;
  createdAt: Date;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");

  // Check if user is admin
  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      toast.success("User role updated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const verifyUserEmail = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/users/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to verify email");

      toast.success("Email verified");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to verify email");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      !searchEmail ||
      user.email?.toLowerCase().includes(searchEmail.toLowerCase())
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/me"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="display-text">User Management</h1>
          <p className="mt-2 text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            type="email"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="max-w-md border-2 border-foreground h-12 px-4"
          />
        </div>

        {/* Users Table */}
        <div className="border-2 border-foreground">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-foreground text-background">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Email</th>
                  <th className="px-4 py-3 text-left font-bold">Name</th>
                  <th className="px-4 py-3 text-left font-bold">Role</th>
                  <th className="px-4 py-3 text-left font-bold">Email Verified</th>
                  <th className="px-4 py-3 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t-2 border-foreground">
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.name || "-"}</td>
                    <td className="px-4 py-3">
                      <Select
                        value={user.role}
                        onValueChange={(value) => updateUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32 h-10 border-2 border-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-2 border-foreground">
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="EXPERT">Expert</SelectItem>
                          <SelectItem value="MODERATOR">Moderator</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      {user.emailVerified ? (
                        <span className="text-sm text-green-600 font-medium">✓ Verified</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => verifyUserEmail(user.id)}
                          className="h-8 text-xs border-2 border-foreground"
                        >
                          Verify
                        </Button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No users found
            </div>
          )}
        </div>

        {/* Role Descriptions */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border-2 border-foreground p-4 bg-muted/30">
            <h3 className="font-bold mb-2">USER</h3>
            <p className="text-sm text-muted-foreground">
              Can post questions and replies
            </p>
          </div>
          <div className="border-2 border-foreground p-4 bg-muted/30">
            <h3 className="font-bold mb-2">EXPERT</h3>
            <p className="text-sm text-muted-foreground">
              Highlighted responses, see expert requests
            </p>
          </div>
          <div className="border-2 border-foreground p-4 bg-muted/30">
            <h3 className="font-bold mb-2">MODERATOR</h3>
            <p className="text-sm text-muted-foreground">
              Can moderate content and manage flags
            </p>
          </div>
          <div className="border-2 border-foreground p-4 bg-muted/30">
            <h3 className="font-bold mb-2">ADMIN</h3>
            <p className="text-sm text-muted-foreground">
              Full access to all features and settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
