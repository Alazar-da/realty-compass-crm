import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UserRole } from '@/data/dummyData';
import { Plus, Trash2, UserCircle, Shield, Users as UsersIcon } from 'lucide-react';
import { useEffect } from 'react';

const roleIcons = {
  super_admin: Shield,
  supervisor: UsersIcon,
  sales: UserCircle,
};

const roleLabels = {
  super_admin: 'Super Admin',
  supervisor: 'Supervisor',
  sales: 'Sales Person',
};

const Users = () => {
  const { currentUser, users, addUser, deleteUser } = useAuth();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sales' as UserRole,
  });

  useEffect(() => {
    if (currentUser?.role !== 'super_admin') {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.password) {
      addUser(newUser);
      setNewUser({ name: '', email: '', password: '', role: 'sales' });
      setIsAddDialogOpen(false);
    }
  };

  const usersByRole = {
    super_admin: users.filter((u) => u.role === 'super_admin'),
    supervisor: users.filter((u) => u.role === 'supervisor'),
    sales: users.filter((u) => u.role === 'sales'),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="font-heading text-3xl font-bold">User Management</h1>
            <p className="mt-1 text-muted-foreground">
              Manage team members and their roles ({users.length} users)
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="sales">Sales Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddUser} className="w-full">
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Users by Role */}
        {(['super_admin', 'supervisor', 'sales'] as UserRole[]).map((role) => {
          const Icon = roleIcons[role];
          return (
            <div key={role} className="card-elevated p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-semibold">
                    {roleLabels[role]}s
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {usersByRole[role].length} member{usersByRole[role].length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {usersByRole[role].map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    {user.id !== currentUser?.id && role !== 'super_admin' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUser(user.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                ))}
              </div>

              {usersByRole[role].length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No {roleLabels[role].toLowerCase()}s yet
                </p>
              )}
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Users;
