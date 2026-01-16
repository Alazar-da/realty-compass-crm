import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  LogOut,
  Building2,
  UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin', 'supervisor', 'sales'],
    },
    {
      name: 'Leads',
      href: '/leads',
      icon: Users,
      roles: ['super_admin', 'supervisor', 'sales'],
    },
    {
      name: 'My Leads',
      href: '/my-leads',
      icon: UserCircle,
      roles: ['sales'],
    },
    {
      name: 'User Management',
      href: '/users',
      icon: UserPlus,
      roles: ['super_admin'],
    },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(currentUser?.role || '')
  );

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Building2 className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-semibold text-sidebar-foreground">
              EstateFlowss
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Real Estate CRM</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'sidebar-link',
                  isActive && 'sidebar-link-active'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-accent-foreground">
              {currentUser?.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {currentUser?.name}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60 capitalize">
                {currentUser?.role.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
