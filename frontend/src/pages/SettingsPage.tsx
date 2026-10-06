import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { User, Mail, Lock, Bell, Palette } from 'lucide-react';
import { useUIStore, selectTheme } from '@stores/uiStore';
import { useLocaleStore, selectLocale } from '@stores/localeStore';
import useAuthStore from '@stores/authStore';
import { useTranslation } from '@hooks/useTranslation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { cn } from '@utils/cn';

export function SettingsPage() {
  const theme = useUIStore(selectTheme);
  const setTheme = useUIStore((state) => state.setTheme);
  const locale = useLocaleStore(selectLocale);
  const setLocale = useUIStore((state) => state.setLocale);
  const { user, updateProfile } = useAuthStore();
  const { t } = useTranslation();

  const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
  });

  type ProfileForm = z.infer<typeof profileSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name ?? '',
      email: user?.email ?? '',
    });
  };

  const themes = [
    { value: 'light' as const, label: 'Light', icon: '☀️' },
    { value: 'dark' as const, label: 'Dark', icon: '🌙' },
    { value: 'system' as const, label: 'System', icon: '💻' },
  ] as const;

  const languages = [
    { value: 'en' as const, label: 'English', nativeLabel: 'English' },
    { value: 'es' as const, label: 'Español', nativeLabel: 'Español' },
    { value: 'id' as const, label: 'Bahasa Indonesia', nativeLabel: 'Bahasa Indonesia' },
  ] as const;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-light-900 dark:text-dark-50">{t('settings.title')}</h1>
        <p className="text-light-600 dark:text-dark-400 mt-1">{t('settings.subtitle')}</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t('settings.profile')}
          </CardTitle>
          <CardDescription>{t('settings.updateProfile')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <Input
              label={t('settings.fullName')}
              placeholder="John Doe"
              {...register('name')}
              error={errors.name?.message}
              icon={<User className="w-4 h-4" />}
            />
            <Input
              label={t('settings.email')}
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
              icon={<Mail className="w-4 h-4" />}
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit" loading={isSubmitting}>
                {t('common.saveChanges')}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {t('settings.security')}
          </CardTitle>
          <CardDescription>{t('settings.changePasswordManageSessions')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-light-100/50 dark:bg-dark-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-light-500 dark:text-dark-400" />
                <div>
                  <p className="font-medium text-light-900 dark:text-white">{t('settings.changePassword')}</p>
                  <p className="text-sm text-light-600 dark:text-dark-400">{t('settings.updateAccountPassword')}</p>
                </div>
              </div>
              <Button variant="secondary">{t('settings.change')}</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-light-100/50 dark:bg-dark-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-light-500 dark:text-dark-400" />
                <div>
                  <p className="font-medium text-light-900 dark:text-white">{t('settings.twoFactorAuth')}</p>
                  <p className="text-sm text-light-600 dark:text-dark-400">{t('settings.addExtraLayerSecurity')}</p>
                </div>
              </div>
              <Button variant="secondary">{t('settings.enable')}</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-light-100/50 dark:bg-dark-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-light-500 dark:text-dark-400" />
                <div>
                  <p className="font-medium text-light-900 dark:text-white">{t('settings.activeSessions')}</p>
                  <p className="text-sm text-light-600 dark:text-dark-400">{t('settings.manageLoggedInDevices')}</p>
                </div>
              </div>
              <Button variant="secondary">{t('settings.view')}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {t('settings.notifications')}
          </CardTitle>
          <CardDescription>{t('settings.configureAlerts')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-light-100/50 dark:bg-dark-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-light-500 dark:text-dark-400" />
                <div>
                  <p className="font-medium text-light-900 dark:text-white">{t('settings.emailAlerts')}</p>
                  <p className="text-sm text-light-600 dark:text-dark-400">{t('settings.receivePriceAlertsEmail')}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-light-600 dark:bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-light-100/50 dark:bg-dark-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-light-500 dark:text-dark-400" />
                <div>
                  <p className="font-medium text-light-900 dark:text-white">{t('settings.pushNotifications')}</p>
                  <p className="text-sm text-light-600 dark:text-dark-400">{t('settings.receivePriceAlertsDevice')}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-light-600 dark:bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
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
            {t('settings.appearance')}
          </CardTitle>
          <CardDescription>{t('settings.customizeAppLook')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="label">{t('settings.theme')}</label>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((tItem) => (
                  <button
                    key={tItem.value}
                    onClick={() => setTheme(tItem.value)}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all font-medium',
                      theme === tItem.value
                        ? 'border-primary-500 bg-primary-500/10 text-light-900 dark:text-white'
                        : 'border-light-300 dark:border-dark-600 hover:border-light-400 dark:hover:border-dark-500 text-light-700 dark:text-dark-300'
                    )}
                    aria-pressed={theme === tItem.value}
                  >
                    <span className="block text-center capitalize">{tItem.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">{t('settings.language')}</label>
              <div className="grid grid-cols-3 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => setLocale(lang.value)}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all font-medium',
                      locale === lang.value
                        ? 'border-primary-500 bg-primary-500/10 text-light-900 dark:text-white'
                        : 'border-light-300 dark:border-dark-600 hover:border-light-400 dark:hover:border-dark-500 text-light-700 dark:text-dark-300'
                    )}
                    aria-pressed={locale === lang.value}
                  >
                    <span className="block text-center">{lang.nativeLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}