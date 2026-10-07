import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Plus, Search } from 'lucide-react';

export function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-light-900 dark:text-white">Price Alerts</h1>
          <p className="mt-1 text-light-600 dark:text-dark-400">
            Set up price notifications for XAUUSD
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Alert
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Alerts</CardTitle>
          <CardDescription>Manage your price alert notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-light-400 dark:text-dark-600" />
            <h3 className="mb-2 text-lg font-medium text-light-900 dark:text-white">
              No alerts yet
            </h3>
            <p className="mb-6 text-light-600 dark:text-dark-400">
              Create your first price alert to get notified when XAUUSD reaches your target price
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create First Alert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
