// Placeholder for workflow orchestration
// Will be implemented as workflows evolve

export interface WorkflowStep {
    name: string;
    execute: () => Promise<void>;
    onError?: (error: Error) => Promise<void>;
    onSuccess?: () => Promise<void>;
}

export abstract class BaseWorkflow {
    protected steps: WorkflowStep[] = [];

    async run(): Promise<void> {
        for (const step of this.steps) {
            try {
                await step.execute();
                if (step.onSuccess) {
                    await step.onSuccess();
                }
            } catch (error) {
                if (step.onError) {
                    await step.onError(error as Error);
                }
                throw error;
            }
        }
    }
}
export * from './OrganizationOnboardingFlow';
