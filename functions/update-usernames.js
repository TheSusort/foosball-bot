#!/usr/bin/env node

/**
 * Script to update existing users with their first names from Slack
 * This script fetches all existing users and updates their usernames
 * using the same logic as the new createUser function
 */

const {db} = require("./firebase");
const {getUserProfile} = require("./foosball/services/slack");
const {escapeHtml} = require("./foosball/services/helpers");
const {determineUsername} = require("./foosball/services/users");

/**
 * Update all existing users with first names from Slack
 */
const updateExistingUsernames = async () => {
    console.log("Starting username update for existing users...");

    try {
        // Get all users from database
        const usersSnapshot = await db.ref("users").once("value");
        const users = usersSnapshot.val();

        if (!users) {
            console.log("No users found in database");
            return;
        }

        const userIds = Object.keys(users);
        console.log(`Found ${userIds.length} users to update`);

        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        // Process each user
        for (const userId of userIds) {
            const user = users[userId];
            const currentName = user.name;

            // Skip if user already has a custom username
            if (!currentName.startsWith("player" + userId)) {
                console.log(
                    `Skipping ${userId} - already has custom username: ` +
                    `${currentName}`,
                );
                skippedCount++;
                continue;
            }

            try {
                // Get Slack profile
                console.log(`Fetching profile for user ${userId}...`);
                const profile = await getUserProfile(userId);

                // Determine new username
                const newUsername = determineUsername(userId, profile);

                // Only update if username changed
                if (newUsername !== currentName) {
                    const escapedUsername = escapeHtml(newUsername);

                    // Update in database
                    await db.ref(`users/${userId}/name`).set(escapedUsername);
                    console.log(
                        `✓ Updated ${userId}: "${currentName}" → ` +
                        `"${escapedUsername}"`,
                    );
                    updatedCount++;
                } else {
                    console.log(`- No change for ${userId}: "${currentName}"`);
                }

                // Add small delay to avoid rate limiting
                await new Promise((resolve) => {
                    setTimeout(resolve, 100);
                });
            } catch (error) {
                console.error(`✗ Error updating ${userId}:`, error.message);
                errorCount++;
            }
        }

        console.log("\n=== Update Summary ===");
        console.log(`Total users: ${userIds.length}`);
        console.log(`Updated: ${updatedCount}`);
        console.log(`Skipped (custom usernames): ${skippedCount}`);
        console.log(`Errors: ${errorCount}`);
        console.log("Update complete!");
    } catch (error) {
        console.error("Failed to update usernames:", error);
    }
};

// Run the script if called directly
if (require.main === module) {
    updateExistingUsernames()
        .then(() => {
            console.log("Script finished");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Script failed:", error);
            process.exit(1);
        });
}

module.exports = {
    updateExistingUsernames,
};
