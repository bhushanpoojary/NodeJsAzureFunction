const { app } = require('@azure/functions');
const df = require('durable-functions');

// Orchestrator: must be deterministic
df.app.orchestration('MyOrchestratorOrchestrator', function* (context) {
    const outputs = [];

    context.log("Before Calling Tokyo..."); // Before checkpoint
    outputs.push(yield context.df.callActivity('MyActivity', 'Tokyo')); // checkpoint

    context.log("Before Calling Seattle..."); // Before checkpoint
    outputs.push(yield context.df.callActivity('MyActivity', 'Seattle')); // checkpoint

    context.log("Before Calling Cairo..."); // Before checkpoint
    outputs.push(yield context.df.callActivity('MyActivity', 'Cairo')); // checkpoint

    return outputs; // Will be replayed deterministically
});

// Activity Function (can be non-deterministic)
df.app.activity('MyActivity', {
    handler: (input) => {
        const randomValue = Math.random(); // Non-deterministic (OK in activity)
        const message = `Hello, ${input} (random: ${randomValue.toFixed(2)})`;
        console.log(`Activity executed: ${message}`);
        return message;
    },
});

// HTTP Starter
app.http('MyOrchestratorHttpStart', {
    route: 'orchestrators/{orchestratorName}',
    extraInputs: [df.input.durableClient()],
    handler: async (request, context) => {
        const client = df.getClient(context);
        const body = await request.text();
        const instanceId = await client.startNew(request.params.orchestratorName, { input: body });

        context.log(`Started orchestration with ID = '${instanceId}'.`);

        return client.createCheckStatusResponse(request, instanceId);
    },
});
