import { Link } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { cn } from '@utils/cn';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-12 px-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-500/20 flex items-center justify-center">
            <Search className="w-10 h-10 text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-light-900 dark:text-white mb-2">404</h1>
          <p className="text-light-600 dark:text-dark-400 mb-6 text-lg">Page not found</p>
          <p className="text-light-500 dark:text-dark-500 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard">
              <Button className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}