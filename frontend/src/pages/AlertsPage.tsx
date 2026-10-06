import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Plus, Bell, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-900 dark:text-white">Price Alerts</h1>
          <p className="text-light-600 dark:text-dark-400 mt-1">Set up price notifications for XAUUSD</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Alert
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Alerts</CardTitle>
          <CardDescription>Manage your price alert notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-light-400 dark:text-dark-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-light-900 dark:text-white mb-2">No alerts yet</h3>
            <p className="text-light-600 dark:text-dark-400 mb-6">Create your first price alert to get notified when XAUUSD reaches your target price</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create First Alert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}