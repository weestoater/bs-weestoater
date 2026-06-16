# Target Weight History - Setup & Usage Guide

## Overview

You can now change your Slimming World target weight without affecting previous weigh-in entries. Each target weight change is tracked with an effective date, so historical entries maintain their original target while new entries use the updated target.

## Setup Instructions

### 1. Run the Database Migration

Execute the SQL migration script in your Supabase SQL Editor:

**Location:** `backend/supabase/add-target-weight-history.sql`

This script will:

- ✅ Create the `slimming_world_target_weights` table
- ✅ Migrate your existing target weight as the initial entry
- ✅ Create a helper function to look up target weights by date
- ✅ Update the profile stats view to show current target weight

### 2. Verify the Migration

After running the script, you should see:

- A new table: `slimming_world_target_weights`
- Your initial target weight with `effective_date` set to your start date
- Success messages in the SQL editor output

## How It Works

### Target Weight History

Each target weight entry has:

- **Target Weight**: The goal weight in lbs
- **Effective Date**: The date from which this target applies
- **Notes**: Optional reason for the change (e.g., "Adjusted goal")

When you create a weigh-in entry, the system automatically uses the target weight that was active on that entry's date.

### Example Timeline

```
Start Date: 2024-01-01
Initial Target: 196 lbs

2024-01-01 ─────► Weigh-in: 282 lbs (target: 196 lbs)
2024-01-08 ─────► Weigh-in: 280 lbs (target: 196 lbs)
2024-01-15 ─────► Weigh-in: 278 lbs (target: 196 lbs)
              │
              │  📌 Change target to 190 lbs (effective: 2024-01-22)
              │
2024-01-22 ─────► Weigh-in: 276 lbs (target: 190 lbs) ✨
2024-01-29 ─────► Weigh-in: 274 lbs (target: 190 lbs) ✨
```

**Key Points:**

- Weigh-ins from Jan 1-15 keep their original target (196 lbs)
- Weigh-ins from Jan 22 onwards use the new target (190 lbs)
- Historical data is preserved exactly as it was

## Using the Feature

### Setting a New Target Weight

1. **Navigate to Admin:**
   - Go to the Admin Dashboard
   - Click "Manage Slimming World Data"

2. **Set New Target:**
   - In the "Target Weight History" section
   - Click "Set New Target" button
   - Fill in the form:
     - **New Target Weight**: Enter your new goal (e.g., 190)
     - **Effective From Date**: Choose when this target starts (usually today)
     - **Reason**: Optional note (e.g., "Reached initial goal, setting new target")
   - Click "Save Target Weight"

3. **Verify:**
   - The new target appears at the top of the history table
   - It's marked with a "Current" badge
   - Future weigh-ins will use this target automatically

### Adding Weigh-In Entries

No changes needed! The weigh-in form works exactly the same:

1. Click "Add Weigh-In"
2. Enter date, weight, change, etc.
3. Submit

The system automatically:

- Looks up the correct target weight for that date
- Saves the entry with the appropriate target
- Calculates "Remaining to Target" correctly

### Viewing Your Progress

- **Main Slimming World Page**: Shows your _current_ target weight
- **Admin Manager**: Shows both:
  - Current target in the Profile Summary
  - Complete target weight history in its own section
- **Weight History**: Each entry shows its target weight at that point in time

## Managing Target Weights

### Viewing History

In the Admin Manager, the "Target Weight History" section shows:

- All target weight changes in reverse chronological order
- Most recent target marked as "Current"
- Effective date for each target
- Optional notes explaining the change

### Deleting a Target Weight

You can delete historical target weights if needed:

1. Click the trash icon next to the target weight
2. Confirm the deletion
3. ⚠️ **Note:** You cannot delete the last remaining target weight

⚠️ **Warning:** Deleting a target weight may affect how historical entries are calculated. Only delete if you're sure!

### Best Practices

1. **Set Realistic Dates**: Use the actual date when you decided to change your target
2. **Add Notes**: Document why you changed your target for future reference
3. **Don't Delete History**: Keep all target changes for accurate historical tracking
4. **Future Dating**: You can set a target for a future date if you know you'll adjust it then

## Technical Details

### Database Structure

**Table:** `slimming_world_target_weights`

- `id`: UUID (primary key)
- `profile_id`: Links to your profile
- `target_weight`: Target weight in lbs (DECIMAL)
- `effective_date`: Date this target becomes active (DATE)
- `notes`: Optional text note
- `created_at`, `updated_at`: Automatic timestamps

### How Lookup Works

When creating a weigh-in entry with date `2024-01-22`:

1. Database finds the most recent target where `effective_date <= 2024-01-22`
2. Uses that target weight for the entry
3. Falls back to profile's original target if no history found

### API Methods

New database service methods:

- `getTargetWeightHistory(profileId)` - Get all target weight changes
- `getCurrentTargetWeight(profileId)` - Get the most recent target
- `getTargetWeightForDate(profileId, date)` - Get target for specific date
- `createTargetWeight(data)` - Add new target weight
- `deleteTargetWeight(id)` - Remove a target weight

## Troubleshooting

### Target weight not showing correctly

- **Check**: Verify the effective date is correct
- **Fix**: Edit the target weight entry in the database or delete and recreate

### Old entries showing wrong target

- **Cause**: Old entries were created before migration
- **Fix**: Edit each entry individually to set the correct target, or run a bulk update

### Can't delete a target weight

- **Reason**: Cannot delete the last remaining target
- **Solution**: Add a new target first, then delete the old one

### New weigh-ins using wrong target

- **Check**: Verify there's a target weight with `effective_date <= entry_date`
- **Fix**: Add a target weight with an earlier or equal effective date

## Migration Checklist

- [ ] Back up your database before running migration
- [ ] Run `backend/supabase/add-target-weight-history.sql` in Supabase
- [ ] Verify initial target weight was created
- [ ] Test creating a new weigh-in entry
- [ ] Test setting a new target weight
- [ ] Verify old entries still show correct data
- [ ] Check main Slimming World page displays current target

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify the migration ran successfully in Supabase
3. Check that the database service methods are exported correctly
4. Ensure your profile has at least one target weight entry

## Future Enhancements

Possible improvements:

- Bulk update old entries to use correct historical targets
- Visual timeline showing target changes on the chart
- Target weight change notifications
- Export target weight history to CSV
