import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { Shield, Globe, Bell, Database, Key, Palette } from 'lucide-react';
import { useState } from 'react';

export function AdminSettingsPage() {
  const [appName, setAppName] = useState('XAU Market Pro');
  const [debugMode, setDebugMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const marketSymbols = ['XAUUSD', 'XAGUSD', 'EURUSD', 'BTCUSD'];
  const [marketParams, setMarketParams] = useState(
    marketSymbols.reduce((acc, sym) => ({ ...acc, [sym]: { support: [2320, 2300, 2280], resistance: [2370, 2390, 2410] } }), {})
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-light-900 dark:text-white">Admin Settings</h1>
        <p className="text-light-600 dark:text-dark-400 mt-1">Configure platform settings and market parameters</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-light-500 dark:text-dark-400" />
            General Settings
          </CardTitle>
          <CardDescription>Basic platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input label="Application Name" value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="XAU Market Pro" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-light-100/50 dark:bg-dark-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-light-500 dark:text-dark-400" />
                <div>
                  <p className="font-medium text-light-900 dark:text-white">Maintenance Mode</p>
                  <p className="text-sm text-light-600 dark:text-dark-400">Disable access for non-admin users</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-light-600 dark:bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-light-100/50 dark:bg-dark-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-light-500 dark:text-dark-400" />
                <div>
                  <p className="font-medium text-light-900 dark:text-white">Debug Mode</p>
                  <p className="text-sm text-light-600 dark:text-dark-400">Enable detailed error logging</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-light-600 dark:bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-light-200 dark:border-dark-700">
            <Button onClick={() => alert('Settings saved!')}>Save Changes</Button>
            <Button variant="secondary">Reset to Defaults</Button>
          </div>
        </CardContent>
      </Card>

      {/* Market Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-light-500 dark:text-dark-400" />
            Market Parameters
          </CardTitle>
          <CardDescription>Configure support and resistance levels for each symbol</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {marketSymbols.map((symbol) => {
              const params = marketParams[symbol];
              return (
                <div key={symbol} className="p-4 bg-dark-800/50 rounded-lg border border-dark-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">{symbol}</h3>
                    <Badge variant="gold">{symbol === 'XAUUSD' ? 'Primary' : 'Secondary'}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="label">Support Levels</label>
                      <div className="flex flex-wrap gap-2">
                        {params.support.map((level, idx) => (
                          <Input
                            key={`${symbol}-support-${idx}`}
                            type="number"
                            step="0.01"
                            value={level}
                            onChange={(e) => setMarketParams({ ...marketParams, [symbol]: { ...params, support: params.support.map((v, i) => i === idx ? parseFloat(e.target.value) : v) } })}
                            className="w-24"
                            placeholder="0.00"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="label">Resistance Levels</label>
                      <div className="flex flex-wrap gap-2">
                        {params.resistance.map((level, idx) => (
                          <Input
                            key={`${symbol}-resistance-${idx}`}
                            type="number"
                            step="0.01"
                            value={level}
                            onChange={(e) => setMarketParams({ ...marketParams, [symbol]: { ...params, resistance: params.resistance.map((v, i) => i === idx ? parseFloat(e.target.value) : v) } })}
                            className="w-24"
                            placeholder="0.00"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 pt-6 border-t border-dark-700">
            <Button onClick={() => alert('Market parameters saved!')}>Save All Parameters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Subscription Plans
          </CardTitle>
          <CardDescription>Configure plan pricing and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Monthly Price</th>
                  <th>Price Alerts</th>
                  <th>Report Exports</th>
                  <th>Advanced Analytics</th>
                  <th>Priority Support</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="font-medium text-white">Basic</span></td>
                  <td><Input type="number" value={29} className="w-24" /></td>
                  <td><Input type="number" value={3} className="w-20" /></td>
                  <td><Input type="number" value={0} className="w-20" /></td>
                  <td><Badge variant="neutral">No</Badge></td>
                  <td><Badge variant="neutral">No</Badge></td>
                </tr>
                <tr>
                  <td><span className="font-medium text-white">Pro</span></td>
                  <td><Input type="number" value={99} className="w-24" /></td>
                  <td><Input type="number" value={-1} className="w-20" placeholder="Unlimited" /></td>
                  <td><Input type="number" value={-1} className="w-20" placeholder="Unlimited" /></td>
                  <td><Badge variant="success">Yes</Badge></td>
                  <td><Badge variant="neutral">No</Badge></td>
                </tr>
                <tr>
                  <td><span className="font-medium text-white">Enterprise</span></td>
                  <td><Input type="number" value={299} className="w-24" /></td>
                  <td><Input type="number" value={-1} className="w-20" placeholder="Unlimited" /></td>
                  <td><Input type="number" value={-1} className="w-20" placeholder="Unlimited" /></td>
                  <td><Badge variant="success">Yes</Badge></td>
                  <td><Badge variant="success">Yes</Badge></td>
                </tr>
              </tbody>
            </table>
            <div className="flex gap-3 pt-4 border-t border-dark-700">
              <Button>Save Plan Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}