import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Play } from 'lucide-react';
import { useSetupStatus, useInitializeSystem } from '../hooks/useSetup';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function SetupPage() {
  const { data: status, isLoading, refetch } = useSetupStatus();
  const initSystem = useInitializeSystem();
  const [showResult, setShowResult] = useState(false);

  const handleInitialize = async () => {
    try {
      await initSystem.mutateAsync();
      setShowResult(true);
      await refetch();
    } catch (err) {
      console.error('Init failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">System Setup</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Initialize the system with default data or check current setup status.
        </p>
      </div>

      <Card>
        <CardHeader title="Setup Status" description="Current system configuration" />
        <CardContent>
          <div className="space-y-4">
            <StatusItem
              label="System Ready"
              status={status?.isReady}
              detail={status?.isReady ? 'System is ready to process events' : 'System requires configuration'}
            />
            <StatusItem
              label="Journey Stages"
              status={status?.hasStages}
              detail={`${status?.stageCount || 0} stages configured`}
            />
            <StatusItem
              label="Channels"
              status={status?.hasChannels}
              detail={`${status?.channelCount || 0} channels configured`}
            />
            <StatusItem
              label="Campaigns"
              status={status?.hasCampaigns}
              detail={`${status?.campaignCount || 0} campaigns configured`}
            />
          </div>

          {status?.issues && status.issues.length > 0 && (
            <div className="mt-6 p-4 bg-[var(--color-danger-light)] border border-[var(--color-danger-border)] rounded-lg">
              <div className="flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-danger)] mb-2">Configuration Issues</h3>
                  <ul className="text-sm text-[var(--color-danger)] space-y-1">
                    {status.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!status?.isReady && (
        <Card>
          <CardHeader title="Initialize System" description="Bootstrap the system with default data" />
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)]">
                This will create default journey stages, channels, and campaigns. The initialization is idempotent -
                existing data will not be duplicated.
              </p>

              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 text-sm">
                <div className="font-medium text-[var(--color-text-primary)] mb-2">What will be created:</div>
                <ul className="text-[var(--color-text-secondary)] space-y-1">
                  <li>5 Journey Stages (Awareness → Consideration → Decision → Purchase → Retention)</li>
                  <li>6 Channels (Organic Search, Direct, Email, Paid Search, Social Media, Display Ads)</li>
                  <li>1 Default Campaign (linked to Direct channel)</li>
                </ul>
              </div>

              <Button
                onClick={handleInitialize}
                isLoading={initSystem.isPending}
                className="w-full sm:w-auto"
              >
                <Play className="w-4 h-4 mr-2" />
                Initialize System
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showResult && initSystem.data && (
        <Card>
          <CardContent>
            <div className="flex gap-3 items-start">
              <CheckCircle className="w-6 h-6 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  {initSystem.data.message}
                </h3>
                {!initSystem.data.alreadyInitialized && (
                  <div className="text-sm text-[var(--color-text-secondary)] space-y-1">
                    <div>Created {initSystem.data.stagesCreated} journey stages</div>
                    <div>Created {initSystem.data.channelsCreated} channels</div>
                    <div>Created {initSystem.data.campaignsCreated} campaigns</div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatusItem({ label, status, detail }: { label: string; status?: boolean; detail: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium text-[var(--color-text-primary)]">{label}</div>
        <div className="text-xs text-[var(--color-text-secondary)]">{detail}</div>
      </div>
      {status ? (
        <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
      ) : (
        <AlertCircle className="w-5 h-5 text-[var(--color-text-tertiary)]" />
      )}
    </div>
  );
}
