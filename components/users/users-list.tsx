"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import ViewProfileDialog from "./view-profile-dialog";
import EditUserDialog from "./edit-user-dialog";
import ChangeRoleDialog from "./change-role-dialog";
import DeactivateUserDialog from "./deactivate-user-dialog";
import { format } from "date-fns";

interface UsersListProps {
  searchQuery: string;
  roleFilter: string;
  statusFilter: string;
}

const roleIcons = {
  Admin: <ShieldAlert className="h-4 w-4 text-red-500" />,
  Manager: <ShieldCheck className="h-4 w-4 text-blue-500" />,
  Operator: <Shield className="h-4 w-4 text-green-500" />,
};

export default function UsersList({
  searchQuery,
  roleFilter,
  statusFilter,
}: UsersListProps) {
  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/users");
        const { users: data } = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    })();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" ||
      user.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserUpdated = (updatedUser: any) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };

  const handleRoleChanged = (userId: string, newRole: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleUserDeactivated = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: "inactive" } : user
      )
    );
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {roleIcons[user.role as keyof typeof roleIcons]}
                  {user.role}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`${
                    user.status === "active" ? "bg-green-500" : "bg-gray-500"
                  } text-white`}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(user.lastActive), "dd:MM:yyyy HH:mm")}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedUser(user);
                        setViewProfileOpen(true);
                      }}
                    >
                      View profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedUser(user);
                        setEditUserOpen(true);
                      }}
                    >
                      Edit user
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedUser(user);
                        setChangeRoleOpen(true);
                      }}
                    >
                      Change role
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setSelectedUser(user);
                        setDeactivateOpen(true);
                      }}
                    >
                      Deactivate user
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedUser && (
        <>
          <ViewProfileDialog
            user={selectedUser}
            open={viewProfileOpen}
            onOpenChange={setViewProfileOpen}
          />
          <EditUserDialog
            user={selectedUser}
            open={editUserOpen}
            onOpenChange={setEditUserOpen}
            onUserUpdated={handleUserUpdated}
          />
          <ChangeRoleDialog
            user={selectedUser}
            open={changeRoleOpen}
            onOpenChange={setChangeRoleOpen}
            onRoleChanged={handleRoleChanged}
          />
          <DeactivateUserDialog
            user={selectedUser}
            open={deactivateOpen}
            onOpenChange={setDeactivateOpen}
            onUserDeactivated={handleUserDeactivated}
          />
        </>
      )}
    </>
  );
}
