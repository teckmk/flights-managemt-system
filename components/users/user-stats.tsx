"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function UserStats() {
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    rolesCount: { Admin: 0, Manager: 0, Operator: 0 },
    recentActivity: { newUsers: 0, deactivated: 0 },
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/users/stats");
        const data = await response.json();
        setStats({
          totalUsers: data.totalUsers,
          activeUsers: data.activeUsers,
          inactiveUsers: data.inactiveUsers,
          rolesCount: data.rolesCount.reduce(
            (acc: any, role: { _id: string; count: number }) => {
              acc[role._id] = role.count;
              return acc;
            },
            { Admin: 0, Manager: 0, Operator: 0 }
          ),
          recentActivity: data.recentActivity,
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <Users className="mr-2 h-4 w-4" />
          User Statistics
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Users</span>
            <Badge variant="secondary">{stats.totalUsers}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Active Users</span>
            <Badge variant="secondary" className="bg-green-500 text-white">
              {stats.activeUsers}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Inactive Users
            </span>
            <Badge variant="secondary" className="bg-gray-500 text-white">
              {stats.inactiveUsers}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Role Distribution</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShieldAlert className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Admins</span>
            </div>
            <Badge variant="secondary">{stats.rolesCount.Admin || 0}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShieldCheck className="mr-2 h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Managers</span>
            </div>
            <Badge variant="secondary">{stats.rolesCount.Manager || 0}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Operators</span>
            </div>
            <Badge variant="secondary">{stats.rolesCount.Operator || 0}</Badge>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UserCheck className="mr-2 h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">New Users</span>
            </div>
            <Badge variant="secondary">{stats.recentActivity.newUsers}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UserX className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Deactivated</span>
            </div>
            <Badge variant="secondary">
              {stats.recentActivity.deactivated}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
