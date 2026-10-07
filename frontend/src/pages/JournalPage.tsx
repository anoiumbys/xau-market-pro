import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export function JournalPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-light-900 dark:text-white">Trade Journal</h1>
          <p className="mt-1 text-light-600 dark:text-dark-400">Record and analyze your trades</p>
        </div>
        <Link to="/journal/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Trade
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Trades</CardTitle>
          <CardDescription>All your trade journal entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-light-400 dark:text-dark-600" />
            <h3 className="mb-2 text-lg font-medium text-light-900 dark:text-white">
              No trades yet
            </h3>
            <p className="mb-6 text-light-600 dark:text-dark-400">
              Start journaling your trades to track performance
            </p>
            <Link to="/journal/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add First Trade
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
