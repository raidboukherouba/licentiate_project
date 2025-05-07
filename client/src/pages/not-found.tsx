import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { House } from 'lucide-react'
export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="grid min-h-full place-items-center bg-background px-6 py-24">
      <div className="text-center">
        <p className="text-base font-semibold text-primary">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance">
          {t("not_found.title")}
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty">
          {t("not_found.description")}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button
            variant="default"
            className="rounded-md px-3.5 py-2.5"
            onClick={() => window.location.href = '/'}
          >
            <House />
            {t("not_found.go_home")}
          </Button>
          <Button
            variant="primary"
            className="text-sm font-semibold"
            onClick={() => window.location.href = '/contact'}
          >
            {t("not_found.contact_support")} <span aria-hidden="true">&rarr;</span>
          </Button>
        </div>
      </div>
    </main>
  );
}