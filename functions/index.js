/**
 * VIT STUDENT PORTAL - Firebase Cloud Functions
 * Provides server-side roll number verification and atomic registration transactions.
 * Vellore Institute of Technology // Deanery of Admissions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function 1: Server-side Roll Number Verification
 * Checks whitelist without exposing private student credentials.
 */
exports.verifyRollNumber = functions.https.onCall(async (data, context) => {
  const rollNumber = (data.rollNumber || '').trim().toUpperCase();
  const rollRegex = /^[0-9]{2}[A-Z]{3}[0-9]{4}$/;

  if (!rollNumber || !rollRegex.test(rollNumber)) {
    return {
      valid: false,
      code: 'INVALID_FORMAT',
      message: 'Invalid VIT Roll Number format. Expected 10 alphanumeric characters (e.g., 21BCE1024).'
    };
  }

  try {
    const approvedDoc = await db.collection('approved_roll_numbers').doc(rollNumber).get();

    if (!approvedDoc.exists) {
      return {
        valid: false,
        code: 'NOT_APPROVED',
        message: 'Roll number not found in VIT Approved Registry. Please contact Admissions.'
      };
    }

    const approvedData = approvedDoc.data();
    const claimDoc = await db.collection('roll_number_claims').doc(rollNumber).get();

    if (claimDoc.exists || approvedData.isRegistered) {
      // Roll is valid but already claimed
      const studentUid = claimDoc.exists ? claimDoc.data().studentUid : null;
      let maskedName = 'Registered Student';

      if (studentUid) {
        const studentDoc = await db.collection('students').doc(studentUid).get();
        if (studentDoc.exists && studentDoc.data().fullName) {
          maskedName = studentDoc.data().fullName
            .split(' ')
            .map((w) => (w.length > 1 ? w[0] + '*'.repeat(w.length - 1) : w))
            .join(' ');
        }
      }

      return {
        valid: true,
        isRegistered: true,
        code: 'ALREADY_REGISTERED',
        message: 'Valid Roll Number — Already Registered & Verified in VIT System.',
        data: {
          rollNumber,
          maskedName,
          campus: approvedData.campus,
          department: approvedData.department,
          degree: approvedData.degree,
          batch: approvedData.batch
        }
      };
    }

    // Roll is approved and available to register
    return {
      valid: true,
      isRegistered: false,
      code: 'VALID_AVAILABLE',
      message: 'Roll Number Approved & Verified! Ready for Student Registration.',
      data: {
        rollNumber,
        fullName: approvedData.fullName,
        campus: approvedData.campus,
        department: approvedData.department,
        degree: approvedData.degree,
        batch: approvedData.batch
      }
    };
  } catch (error) {
    console.error('Error verifying roll number:', error);
    throw new functions.https.HttpsError('internal', 'Server error during roll verification.');
  }
});

/**
 * Cloud Function 2: Atomic Student Registration
 * Guarantees zero duplicates using Firestore RunTransaction.
 */
exports.registerStudentWithRoll = functions.https.onCall(async (data, context) => {
  const { fullName, rollNumber: rawRoll, email, password, campus, department } = data;
  const rollNumber = (rawRoll || '').trim().toUpperCase();

  if (!fullName || !rollNumber || !email || !password) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required registration parameters.');
  }

  // 1. Create User in Firebase Authentication
  let userRecord;
  try {
    userRecord = await admin.auth().createUser({
      email: email.trim().toLowerCase(),
      password: password,
      displayName: fullName.trim()
    });
  } catch (authError) {
    throw new functions.https.HttpsError('already-exists', authError.message || 'Email already in use.');
  }

  const uid = userRecord.uid;

  // 2. Atomic Transaction in Firestore
  try {
    await db.runTransaction(async (transaction) => {
      const approvedRef = db.collection('approved_roll_numbers').doc(rollNumber);
      const claimRef = db.collection('roll_number_claims').doc(rollNumber);
      const studentRef = db.collection('students').doc(uid);

      const approvedDoc = await transaction.get(approvedRef);
      if (!approvedDoc.exists) {
        throw new Error(`Roll number ${rollNumber} is not approved in the VIT Master Registry.`);
      }

      const claimDoc = await transaction.get(claimRef);
      if (claimDoc.exists || approvedDoc.data().isRegistered) {
        throw new Error(`Roll number ${rollNumber} is already registered by another student.`);
      }

      const verificationHash = `VIT-SEC-${rollNumber}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // Write student record
      transaction.set(studentRef, {
        uid,
        rollNumber,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        campus: campus || approvedDoc.data().campus,
        department: department || approvedDoc.data().department,
        degree: approvedDoc.data().degree || 'B.Tech',
        batch: approvedDoc.data().batch || '2024-2028',
        registeredAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'Verified Active',
        verificationHash
      });

      // Write atomic claim lock
      transaction.set(claimRef, {
        rollNumber,
        studentUid: uid,
        claimedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Mark approved record as registered
      transaction.update(approvedRef, {
        isRegistered: true,
        registeredUid: uid
      });
    });

    return {
      success: true,
      uid,
      rollNumber,
      message: 'Student registration successfully committed.'
    };
  } catch (txError) {
    // Rollback Firebase Auth user if transaction fails
    await admin.auth().deleteUser(uid);
    throw new functions.https.HttpsError('aborted', txError.message || 'Transaction aborted.');
  }
});

/**
 * Cloud Function 3: Assign Admin Role via Firebase Custom Claims
 */
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // Only existing admins can grant admin rights
  if (!context.auth || !context.auth.token || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Only authorized admins can assign roles.');
  }

  const { targetEmail } = data;
  try {
    const targetUser = await admin.auth().getUserByEmail(targetEmail);
    await admin.auth().setCustomUserClaims(targetUser.uid, { admin: true });
    return { success: true, message: `Admin privileges granted to ${targetEmail}` };
  } catch (e) {
    throw new functions.https.HttpsError('not-found', 'Target user email not found.');
  }
});
