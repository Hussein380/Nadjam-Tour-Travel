'use client';

import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Hotels</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/hotels">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Hotel
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Add, edit, or remove hotel listings.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Packages</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/packages">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Package
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Create, update, or delete travel packages.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminAuthGuard>
      <AdminDashboard />
    </AdminAuthGuard>
  );
} 