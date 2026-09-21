import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { User, Mail, Lock, Bell, Palette, Globe } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-dark-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4 max-w-md">
            <Input label="Full Name" placeholder="John Doe" defaultValue="John Doe" icon={<User className="w-4 h-4" />} />
            <Input label="Email" type="email" placeholder="you@example.com" defaultValue="trader@xaupro.test" icon={<Mail className="w-4 h-4" />} />
            <div className="flex gap-3 pt-4">
              <Button>Save Changes</Button>
              <Button variant="secondary">Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>Change your password and manage sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-dark-400" />
                <div>
                  <p className="font-medium text-white">Change Password</p>
                  <p className="text-sm text-dark-400">Update your account password</p>
                </div>
              </div>
              <Button variant="secondary">Change</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-dark-400" />
                <div>
                  <p className="font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-dark-400">Add an extra layer of security</p>
                </div>
              </div>
              <Button variant="secondary">Enable</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-dark-400" />
                <div>
                  <p className="font-medium text-white">Active Sessions</p>
                  <p className="text-sm text-dark-400">Manage your logged-in devices</p>
                </div>
              </div>
              <Button variant="secondary">View</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-dark-400" />
                <div>
                  <p className="font-medium text-white">Email Alerts</p>
                  <p className="text-sm text-dark-400">Receive price alerts via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-dark-400" />
                <div>
                  <p className="font-medium text-white">Push Notifications</p>
                  <p className="text-sm text-dark-400">Receive price alerts on your device</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="label">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map((theme) => (
                  <button
                    key={theme}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all',
                      theme === 'dark'
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-600 hover:border-dark-500'
                    )}
                  >
                    <span className="capitalize">{theme}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Language</label>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 rounded-lg border-2 border-primary-500 bg-primary-500/10">English</button>
                <button className="p-4 rounded-lg border-2 border-dark-600 hover:border-dark-500">Español</button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { cn } from '@utils/cn';