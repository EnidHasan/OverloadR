/**
 * Data Consolidation Script
 * This script helps consolidate user accounts in MongoDB
 * 
 * Usage:
 * node consolidateData.js --remove-duplicates
 * node consolidateData.js --list-users
 * node consolidateData.js --delete-user <email>
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Plan = require('../models/Plan');

async function listAllUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find({}, 'email createdAt');
    console.log('📋 All Users in Database:\n');
    users.forEach((user, idx) => {
      console.log(`${idx + 1}. Email: ${user.email}`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Created: ${user.createdAt}\n`);
    });

    console.log(`Total Users: ${users.length}\n`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

async function deleteDuplicateAccounts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Keep enid.hasan.21@gmail.com, delete others
    const primaryEmail = 'enid.hasan.21@gmail.com';
    
    const primaryUser = await User.findOne({ email: primaryEmail });
    if (!primaryUser) {
      console.error(`❌ Primary account ${primaryEmail} not found!`);
      return;
    }

    console.log(`✅ Primary account: ${primaryEmail} (ID: ${primaryUser._id})\n`);

    // Find all other users
    const otherUsers = await User.find({ email: { $ne: primaryEmail } });
    console.log(`Found ${otherUsers.length} other account(s) to remove:\n`);

    for (const user of otherUsers) {
      console.log(`🗑️  Deleting: ${user.email}`);
      
      // Delete user's plans
      const deletedPlans = await Plan.deleteMany({ userId: user._id });
      console.log(`   Deleted ${deletedPlans.deletedCount} plans`);
      
      // Delete user account
      await User.deleteOne({ _id: user._id });
      console.log(`   Deleted account\n`);
    }

    console.log('✅ Consolidation complete!');
    console.log(`✅ All data is now associated with: ${primaryEmail}\n`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

async function deleteSpecificUser(email) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ User ${email} not found!`);
      return;
    }

    console.log(`🗑️  Deleting account: ${email}`);
    console.log(`   ID: ${user._id}\n`);

    // Delete user's plans
    const deletedPlans = await Plan.deleteMany({ userId: user._id });
    console.log(`✅ Deleted ${deletedPlans.deletedCount} plans`);

    // Delete user account
    await User.deleteOne({ _id: user._id });
    console.log(`✅ Deleted user account\n`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === '--list-users') {
  listAllUsers();
} else if (command === '--remove-duplicates') {
  console.log('🔄 Consolidating accounts...\n');
  deleteDuplicateAccounts();
} else if (command === '--delete-user' && args[1]) {
  deleteSpecificUser(args[1]);
} else {
  console.log(`
📚 Data Consolidation Script

Usage:
  node consolidateData.js --list-users          List all user accounts
  node consolidateData.js --remove-duplicates   Keep only enid.hasan.21@gmail.com
  node consolidateData.js --delete-user <email> Delete specific account and its plans

Example:
  node consolidateData.js --delete-user kamrul@gmail.com
  `);
}
