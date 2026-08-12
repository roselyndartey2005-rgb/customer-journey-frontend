import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { SetupStatusResponse, SystemInitResponse } from '../types';

export function useSetupStatus() {
  return useQuery<SetupStatusResponse>({
    queryKey: ['setupStatus'],
    queryFn: async () => {
      const { data } = await api.get('/api/admin/setup-status');
      return data;
    },
  });
}

export function useInitializeSystem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<SystemInitResponse> => {
      // Manual initialization since /api/admin/init has a bug with created_by field
      let stagesCreated = 0;
      let channelsCreated = 0;
      let campaignsCreated = 0;
      let alreadyInitialized = false;

      try {
        // Check current status
        const { data: status } = await api.get<SetupStatusResponse>('/api/admin/setup-status');

        if (status.hasStages && status.hasChannels && status.hasCampaigns) {
          return {
            stagesCreated: 0,
            channelsCreated: 0,
            campaignsCreated: 0,
            alreadyInitialized: true,
            message: 'System is already initialized',
          };
        }

        // Create stages if missing
        if (!status.hasStages) {
          const stages = [
            { name: 'Awareness', sortOrder: 1 },
            { name: 'Consideration', sortOrder: 2 },
            { name: 'Decision', sortOrder: 3 },
            { name: 'Purchase', sortOrder: 4 },
            { name: 'Retention', sortOrder: 5 },
          ];

          for (const stage of stages) {
            try {
              await api.post('/api/admin/journey-stages', stage);
              stagesCreated++;
            } catch (err) {
              console.warn('Failed to create stage:', stage.name, err);
            }
          }
        }

        // Create channels if missing
        if (!status.hasChannels) {
          const channels = [
            { name: 'Organic Search', category: 'EARNED' },
            { name: 'Direct', category: 'DIRECT' },
            { name: 'Email', category: 'OWNED' },
            { name: 'Paid Search', category: 'PAID' },
            { name: 'Social Media', category: 'EARNED' },
            { name: 'Display Ads', category: 'PAID' },
          ];

          for (const channel of channels) {
            try {
              await api.post('/api/channels', channel);
              channelsCreated++;
            } catch (err) {
              console.warn('Failed to create channel:', channel.name, err);
            }
          }
        }

        // Create default campaign if missing
        if (!status.hasCampaigns && channelsCreated > 0) {
          try {
            // Get the "Direct" channel ID
            const { data: allChannels } = await api.get('/api/channels');
            const directChannel = allChannels.find((c: any) => c.name === 'Direct');

            if (directChannel) {
              await api.post('/api/campaigns', {
                channelId: directChannel.channelId,
                name: 'Default Campaign',
                campaignStatus: 'ACTIVE',
              });
              campaignsCreated++;
            }
          } catch (err) {
            console.warn('Failed to create default campaign:', err);
          }
        }

        return {
          stagesCreated,
          channelsCreated,
          campaignsCreated,
          alreadyInitialized,
          message: 'System initialized successfully',
        };
      } catch (error) {
        console.error('Initialization error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setupStatus'] });
      queryClient.invalidateQueries({ queryKey: ['journeyStages'] });
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
