import cron from 'node-cron';
import Lead from '../models/Lead.js';
import Photographer from '../models/Photographer.js';
import { sendReminderEmail } from './emailService.js';

export const startScheduler = () => {
    // Schedule task to run every day at 9:00 AM
    // For testing/demo purposes, you can change this to '* * * * *' to run every minute
    // Run every minute for testing (as requested)
    cron.schedule('* * * * *', async () => {
        console.log('[SCHEDULER] Running daily event reminder check...');

        try {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const dayAfter = new Date(tomorrow);
            dayAfter.setDate(dayAfter.getDate() + 1);


            console.log(`[SCHEDULER] Checking for events on: ${tomorrow.toDateString()}`);
            console.log(`[DEBUG] Range: ${tomorrow.toISOString()} -> ${dayAfter.toISOString()}`);

            // Find leads with eventDate occurring tomorrow
            const upcomingLeads = await Lead.find({
                eventDate: {
                    $gte: tomorrow,
                    $lt: dayAfter
                }
            });

            console.log(`[SCHEDULER] Found ${upcomingLeads.length} upcoming events for tomorrow.`);

            for (const lead of upcomingLeads) {
                if (lead.people && lead.people.length > 0) {
                    for (const personName of lead.people) {
                        // Find photographer by name (since people array stores names)
                        const photographer = await Photographer.findOne({ name: personName });

                        if (photographer && photographer.email) {
                            await sendReminderEmail(
                                photographer.email,
                                photographer.name,
                                lead.name,
                                lead.eventType,
                                lead.eventDate.toDateString(),
                                lead.eventTime || "TBD",
                                lead.eventLocation || "TBD"
                            );
                        } else {
                            console.log(`[SCHEDULER] Photographer ${personName} not found or has no email.`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('[SCHEDULER] Error running reminder job:', error);
        }
    });

    console.log('[SCHEDULER] Event Reminder Job started (Runs daily at 9:00 AM).');
};
