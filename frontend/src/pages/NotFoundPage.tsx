import { Link } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { Home, Search, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="px-8 py-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-500/20">
            <Search className="h-10 w-10 text-primary-400" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-light-900 dark:text-white">404</h1>
          <p className="mb-6 text-lg text-light-600 dark:text-dark-400">Page not found</p>
          <p className="mb-8 text-light-500 dark:text-dark-500">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't
            exist.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/dashboard">
              <Button className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
