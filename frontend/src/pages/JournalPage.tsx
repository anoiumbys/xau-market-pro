import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { BookOpen, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export function JournalPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-900 dark:text-white">Trade Journal</h1>
          <p className="text-light-600 dark:text-dark-400 mt-1">Record and analyze your trades</p>
        </div>
        <Link to="/journal/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
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
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-light-400 dark:text-dark-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-light-900 dark:text-white mb-2">No trades yet</h3>
            <p className="text-light-600 dark:text-dark-400 mb-6">Start journaling your trades to track performance</p>
            <Link to="/journal/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add First Trade
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}