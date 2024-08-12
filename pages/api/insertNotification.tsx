// Import necessary modules and functions
import { db } from '../../src/db'; // Assuming 'db' is your database setup
import { format } from 'date-fns'; // Import format function from date-fns
import cron from 'node-cron';
import { reminder, notification, peopleToRemind } from '../../src/schema';
import { eq } from 'drizzle-orm';

// Function to format a date in 'yyyy-mm-dd hh:mm:ss'
function formatDate2(date: any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function checkReminders() {
  try {
    // Get current time
    const now = new Date();
    const nowS = formatDate2(now); // Formatting current time
    const parsedDate = new Date(nowS);

    console.log(`Checking reminders at ${nowS}`); // Debug log

    // Fetch reminders that are due and haven't been notified
    const dueReminders = await db.select()
      .from(reminder)
      .where(eq(reminder.reminder_time, parsedDate));

    console.log(`Found ${dueReminders.length} reminders due.`);

    if (dueReminders.length === 0) {
      console.log('No reminders due at this time.');
      return;
    }

    for (const rem of dueReminders) {
      const reminderId = rem.id;
      console.log(`Processing reminder ID: ${reminderId}`);

      // Fetch the people to remind for the current reminder
      const pToremind = await db.select()
        .from(peopleToRemind)
        .where(eq(peopleToRemind.reminderId, reminderId));

      console.log(`Found ${pToremind.length} people to remind for reminder ID: ${reminderId}`);

      if (pToremind.length === 0) {
        console.log(`No people to remind for reminder ID: ${reminderId}`);
        continue;
      }

      for (const P of pToremind) {
        console.log(`Sending notification to user ID: ${P.id}`);
        await db.insert(notification).values({
          title: rem.title,
          description: rem.description,
          employeeId: P.id,
          seen: false,
        });
      }
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
}

// Schedule the task to run every minute using node-cron
cron.schedule('* * * * *', checkReminders);
