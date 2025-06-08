const { app } = require('@azure/functions');

app.timer('SimpleTimerTriggerFunction', {
    schedule: '*/1 * * * *',
    handler: (myTimer, context) => {
        const timeStamp = new Date().toISOString();
        context.log(`⏰ Timer trigger function ran at: ${timeStamp}`);
    }
});
