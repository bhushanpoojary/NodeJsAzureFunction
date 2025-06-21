const { app } = require('@azure/functions');

const random = () => Math.floor(Math.random() * 5) + 1;

app.http('RandomErrorFunction', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const value = random();
        context.log(`Function triggered with value: ${value}`);

        if (value % 2 === 0) {
            context.log.error(`Simulated error occurred with value: ${value}`);
            throw new Error(`Simulated exception for value: ${value}`);
        }

        return {
            status: 200,
            body: 'Function executed successfully.'
        };
    }
});
