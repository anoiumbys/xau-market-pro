import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Check, Crown, Shield } from 'lucide-react';
import { PLAN_FEATURES, PLAN_PRICES, type PlanType } from '@types';

const plans: PlanType[] = ['basic', 'pro', 'enterprise'];

export function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscription</h1>
        <p className="text-dark-400 mt-1">Choose the plan that fits your trading needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const features = PLAN_FEATURES[plan];
          const price = PLAN_PRICES[plan];
          const isPopular = plan === 'pro';

          return (
            <Card key={plan} className={isPopular ? 'border-gold-500/50 bg-gold-500/5' : ''} gold={isPopular}>
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gold-500 text-dark-950 text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="capitalize">{plan}</CardTitle>
                <CardDescription>{features.name} plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl font-bold text-white">${price}</span>
                  <span className="text-dark-400">/month</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-dark-300">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Price alerts: {features.alerts === -1 ? 'Unlimited' : features.alerts}</span>
                  </li>
                  <li className="flex items-center gap-3 text-dark-300">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Report exports: {features.exports === -1 ? 'Unlimited' : features.exports === 0 ? 'Not included' : features.exports}</span>
                  </li>
                  <li className="flex items-center gap-3 text-dark-300">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Trade journal</span>
                  </li>
                  <li className="flex items-center gap-3 text-dark-300">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Real-time charts</span>
                  </li>
                  {plan !== 'basic' && (
                    <li className="flex items-center gap-3 text-dark-300">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>Advanced analytics</span>
                    </li>
                  )}
                  {plan === 'enterprise' && (
                    <li className="flex items-center gap-3 text-dark-300">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>Priority support</span>
                    </li>
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={isPopular ? 'gold' : 'primary'}>
                  {plan === 'basic' ? 'Start Free' : plan === 'pro' ? 'Get Started' : 'Contact Sales'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Card className="bg-primary-500/10 border-primary-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-400" />
            Secure Payment
          </CardTitle>
          <CardDescription>All payments are processed securely. Cancel anytime.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <Crown className="w-8 h-8 text-gold-400 mx-auto mb-2" />
            <p className="font-medium text-white">No Contracts</p>
            <p className="text-sm text-dark-400">Cancel anytime</p>
          </div>
          <div className="p-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Instant Access
            </CardTitle>
            <p className="text-sm text-dark-400">Features activate immediately</p>
          </div>
          <div className="p-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-primary-400" />
              Secure Billing
            </CardTitle>
            <p className="text-sm text-dark-400">SSL encrypted payments</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}