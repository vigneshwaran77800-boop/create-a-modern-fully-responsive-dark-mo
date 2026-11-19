/**
 * VIT STUDENT PORTAL - Firebase Configuration & Persistent Data Engine
 * Vellore Institute of Technology // Official Verification Ecosystem
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_KEYS = {
    APPROVED_ROLLS: 'vit_approved_roll_numbers',
    STUDENTS: 'vit_students',
    ADMINS: 'vit_admins',
    CLAIMS: 'vit_roll_claims',
    LOGS: 'vit_audit_logs',
    CURRENT_USER: 'vit_current_user',
    FIREBASE_CONFIG: 'vit_custom_firebase_config'
  };

  // Initial Seed Data
  const INITIAL_APPROVED_ROLLS = [
    {
      rollNumber: '21BCE1024',
      fullName: 'Vigneshwaran S.',
      campus: 'Vellore',
      department: 'Computer Science & Engineering',
      degree: 'B.Tech CSE',
      batch: '2021-2025',
      isRegistered: false,
      approvedBy: 'Admissions Office',
      approvedAt: '2021-08-15'
    },
    {
      rollNumber: '21BCE0452',
      fullName: 'Ananya Deshmukh',
      campus: 'Chennai',
      department: 'Computer Science & Engineering',
      degree: 'B.Tech CSE',
      batch: '2021-2025',
      isRegistered: false,
      approvedBy: 'Admissions Office',
      approvedAt: '2021-08-15'
    },
    {
      rollNumber: '22MIS0142',
      fullName: 'Rohan Kulkarni',
      campus: 'Vellore',
      department: 'Software Engineering',
      degree: 'Integrated M.Tech SE',
      batch: '2022-2027',
      isRegistered: false,
      approvedBy: 'Admissions Office',
      approvedAt: '2022-08-20'
    },
    {
      rollNumber: '22BCS0911',
      fullName: 'Siddharth Varma',
      campus: 'AP',
      department: 'Computer Science',
      degree: 'B.Tech CSE',
      batch: '2022-2026',
      isRegistered: false,
      approvedBy: 'Admissions Office',
      approvedAt: '2022-08-20'
    },
    {
      rollNumber: '23BME0055',
      fullName: 'Kavita Reddy',
      campus: 'Bhopal',
      department: 'Mechanical Engineering',
      degree: 'B.Tech ME',
      batch: '2023-2027',
      isRegistered: false,
      approvedBy: 'Admissions Office',
      approvedAt: '2023-08-10'
    },
    {
      rollNumber: '23BDS0198',
      fullName: 'Aditya Mehta',
      campus: 'Vellore',
      department: 'Data Science',
      degree: 'B.Tech CSE (DS)',
      batch: '2023-2027',
      isRegistered: false,
      approvedBy: 'Admissions Office',
      approvedAt: '2023-08-10'
    },
    {
      rollNumber: '24BCE1102',
      fullName: 'Tanvi Joshi',
      campus: 'Chennai',
      department: 'AI & Machine Learning',
      degree: 'B.Tech CSE (AIML)',
      batch: '2024-2028',
      isRegistered: false,
      approvedBy: 'Admissions Office',
      approvedAt: '2024-08-12'
    },
    {
      rollNumber: '20BCE2001',
      fullName: 'Aarav Sharma',
      campus: 'Vellore',
      department: 'Computer Science & Engineering',
      degree: 'B.Tech CSE',
      batch: '2020-2024',
      isRegistered: true,
      approvedBy: 'Admissions Office',
      approvedAt: '2020-08-10'
    },
    {
      rollNumber: '22BCE1530',
      fullName: 'Priya Nair',
      campus: 'Vellore',
      department: 'Computer Science & Engineering',
      degree: 'B.Tech CSE',
      batch: '2022-2026',
      isRegistered: true,
      approvedBy: 'Admissions Office',
      approvedAt: '2022-08-20'
    }
  ];

  const INITIAL_STUDENTS = [
    {
      uid: 'std_20bce2001',
      rollNumber: '20BCE2001',
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma2020@vitstudent.ac.in',
      password: 'Student@123',
      campus: 'Vellore',
      department: 'Computer Science & Engineering',
      degree: 'B.Tech CSE',
      batch: '2020-2024',
      registeredAt: '2024-01-10T11:20:00Z',
      status: 'Verified Active',
      verificationHash: 'VIT-SEC-20BCE2001-A9F73'
    },
    {
      uid: 'std_22bce1530',
      rollNumber: '22BCE1530',
      fullName: 'Priya Nair',
      email: 'priya.nair2022@vitstudent.ac.in',
      password: 'Student@123',
      campus: 'Vellore',
      department: 'Computer Science & Engineering',
      degree: 'B.Tech CSE',
      batch: '2022-2026',
      registeredAt: '2024-02-14T09:45:00Z',
      status: 'Verified Active',
      verificationHash: 'VIT-SEC-22BCE1530-C4E88'
    }
  ];

  const INITIAL_ADMINS = [
    {
      uid: 'admin_registrar',
      email: 'admin@vit.ac.in',
      password: 'VitAdmin#2026!',
      fullName: 'Dr. K. Ramanathan',
      role: 'Dean of Academic Admissions',
      department: 'Registrar & Academic Affairs',
      campus: 'Vellore (HQ)'
    }
  ];

  const INITIAL_CLAIMS = {
    '20BCE2001': 'std_20bce2001',
    '22BCE1530': 'std_22bce1530'
  };

  const INITIAL_LOGS = [
    {
      id: 'log_001',
      type: 'VERIFICATION',
      rollNumber: '21BCE1024',
      status: 'VALID_UNREGISTERED',
      timestamp: '2026-11-19T08:30:12Z',
      ip: '14.139.183.15'
    },
    {
      id: 'log_002',
      type: 'REGISTRATION',
      rollNumber: '22BCE1530',
      studentName: 'Priya Nair',
      timestamp: '2026-11-19T09:12:44Z',
      ip: '14.139.183.22'
    }
  ];

  // Engine Helpers
  function initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.APPROVED_ROLLS)) {
      localStorage.setItem(STORAGE_KEYS.APPROVED_ROLLS, JSON.stringify(INITIAL_APPROVED_ROLLS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMINS)) {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLAIMS)) {
      localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(INITIAL_CLAIMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
    }
  }

  function getStored(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage parse error:', e);
      return null;
    }
  }

  function setStored(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }

  function generateHash(rollNumber) {
    const chars = '0123456789ABCDEF';
    let rand = '';
    for (let i = 0; i < 5; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `VIT-SEC-${rollNumber.toUpperCase()}-${rand}`;
  }

  function appendLog(type, details) {
    const logs = getStored(STORAGE_KEYS.LOGS) || [];
    const newLog = {
      id: 'log_' + Date.now(),
      type,
      ...details,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    if (logs.length > 50) logs.pop(); // Keep latest 50
    setStored(STORAGE_KEYS.LOGS, logs);
  }

  // Initialize data on load
  initStorage();

  // Public API
  window.VitAPI = {
    // 1. Verify Roll Number
    verifyRollNumber: function (rawRoll) {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!rawRoll) {
            resolve({
              valid: false,
              code: 'EMPTY_INPUT',
              message: 'Please provide a valid VIT Roll Number.'
            });
            return;
          }

          const roll = rawRoll.trim().toUpperCase();
          const regex = /^[0-9]{2}[A-Z]{3}[0-9]{4}$/;

          if (!regex.test(roll)) {
            appendLog('VERIFICATION', { rollNumber: roll, status: 'INVALID_FORMAT' });
            resolve({
              valid: false,
              code: 'INVALID_FORMAT',
              message: 'Invalid Roll Number format. Expected format: 21BCE1024.'
            });
            return;
          }

          const approvedList = getStored(STORAGE_KEYS.APPROVED_ROLLS) || [];
          const record = approvedList.find((r) => r.rollNumber === roll);

          if (!record) {
            appendLog('VERIFICATION', { rollNumber: roll, status: 'NOT_FOUND' });
            resolve({
              valid: false,
              code: 'NOT_APPROVED',
              message: 'Roll number not found in VIT Approved Registry. Please contact Academic Admissions.'
            });
            return;
          }

          // Check if already registered
          const claims = getStored(STORAGE_KEYS.CLAIMS) || {};
          const isClaimed = !!claims[roll];

          if (isClaimed || record.isRegistered) {
            const students = getStored(STORAGE_KEYS.STUDENTS) || [];
            const student = students.find((s) => s.rollNumber === roll);
            
            // Mask student name for privacy: e.g. "Priya Nair" -> "P**** N***"
            let maskedName = 'Registered Student';
            if (student && student.fullName) {
              maskedName = student.fullName
                .split(' ')
                .map((word) => (word.length > 1 ? word[0] + '*'.repeat(word.length - 1) : word))
                .join(' ');
            }

            appendLog('VERIFICATION', { rollNumber: roll, status: 'ALREADY_REGISTERED' });
            resolve({
              valid: true,
              isRegistered: true,
              code: 'ALREADY_REGISTERED',
              message: 'Valid Roll Number — Already Registered & Verified in VIT System.',
              data: {
                rollNumber: roll,
                maskedName: maskedName,
                campus: record.campus,
                department: record.department,
                degree: record.degree,
                batch: record.batch,
                registeredAt: student ? student.registeredAt : record.approvedAt,
                verificationHash: student ? student.verificationHash : generateHash(roll)
              }
            });
            return;
          }

          // Valid and available for registration
          appendLog('VERIFICATION', { rollNumber: roll, status: 'VALID_UNREGISTERED' });
          resolve({
            valid: true,
            isRegistered: false,
            code: 'VALID_AVAILABLE',
            message: 'Roll Number Approved & Verified! Available for Student Registration.',
            data: {
              rollNumber: roll,
              fullName: record.fullName,
              campus: record.campus,
              department: record.department,
              degree: record.degree,
              batch: record.batch
            }
          });
        }, 300);
      });
    },

    // 2. Register Student with Atomic Lock
    registerStudent: function (formData) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const { fullName, rollNumber: rawRoll, email, password, campus, department } = formData;
          const roll = (rawRoll || '').trim().toUpperCase();

          if (!fullName || !roll || !email || !password) {
            reject(new Error('All required fields must be completed.'));
            return;
          }

          const approvedList = getStored(STORAGE_KEYS.APPROVED_ROLLS) || [];
          const recordIndex = approvedList.findIndex((r) => r.rollNumber === roll);

          if (recordIndex === -1) {
            reject(new Error(`Roll number ${roll} is not approved in the VIT Master Registry.`));
            return;
          }

          const claims = getStored(STORAGE_KEYS.CLAIMS) || {};
          if (claims[roll] || approvedList[recordIndex].isRegistered) {
            reject(new Error(`Duplicate Registration Blocked: Roll number ${roll} is already registered.`));
            return;
          }

          const students = getStored(STORAGE_KEYS.STUDENTS) || [];
          const emailExists = students.some((s) => s.email.toLowerCase() === email.trim().toLowerCase());
          if (emailExists) {
            reject(new Error(`An account with email ${email} already exists.`));
            return;
          }

          // Atomic Claim & Student Creation
          const uid = 'std_' + roll.toLowerCase();
          const verificationHash = generateHash(roll);

          const newStudent = {
            uid,
            rollNumber: roll,
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            password: password, // Note: In production Firebase Auth hashes passwords
            campus: campus || approvedList[recordIndex].campus,
            department: department || approvedList[recordIndex].department,
            degree: approvedList[recordIndex].degree || 'B.Tech',
            batch: approvedList[recordIndex].batch || '2024-2028',
            registeredAt: new Date().toISOString(),
            status: 'Verified Active',
            verificationHash
          };

          // Update claims map
          claims[roll] = uid;
          setStored(STORAGE_KEYS.CLAIMS, claims);

          // Update approved list registration status
          approvedList[recordIndex].isRegistered = true;
          setStored(STORAGE_KEYS.APPROVED_ROLLS, approvedList);

          // Save student record
          students.push(newStudent);
          setStored(STORAGE_KEYS.STUDENTS, students);

          // Log event
          appendLog('REGISTRATION', {
            rollNumber: roll,
            studentName: newStudent.fullName,
            email: newStudent.email
          });

          // Set current user session
          const sessionUser = { ...newStudent, role: 'student' };
          delete sessionUser.password;
          setStored(STORAGE_KEYS.CURRENT_USER, sessionUser);

          resolve({
            success: true,
            student: sessionUser,
            verificationHash
          });
        }, 400);
      });
    },

    // 3. Login Student
    loginStudent: function (email, password) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const students = getStored(STORAGE_KEYS.STUDENTS) || [];
          const user = students.find(
            (s) => s.email.toLowerCase() === (email || '').trim().toLowerCase() && s.password === password
          );

          if (!user) {
            reject(new Error('Invalid student email or password.'));
            return;
          }

          const sessionUser = { ...user, role: 'student' };
          delete sessionUser.password;
          setStored(STORAGE_KEYS.CURRENT_USER, sessionUser);
          appendLog('AUTH_LOGIN', { email: user.email, role: 'student' });

          resolve(sessionUser);
        }, 300);
      });
    },

    // 4. Login Admin
    loginAdmin: function (email, password) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const admins = getStored(STORAGE_KEYS.ADMINS) || [];
          const admin = admins.find(
            (a) => a.email.toLowerCase() === (email || '').trim().toLowerCase() && a.password === password
          );

          if (!admin) {
            reject(new Error('Invalid administrator credentials. Access Denied.'));
            return;
          }

          const sessionAdmin = { ...admin, role: 'admin' };
          delete sessionAdmin.password;
          setStored(STORAGE_KEYS.CURRENT_USER, sessionAdmin);
          appendLog('AUTH_LOGIN', { email: admin.email, role: 'admin' });

          resolve(sessionAdmin);
        }, 300);
      });
    },

    // 5. Logout
    logout: function () {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return Promise.resolve(true);
    },

    // 6. Get Current User Session
    getCurrentUser: function () {
      return getStored(STORAGE_KEYS.CURRENT_USER);
    },

    // 7. Get All Approved Roll Numbers (Admin)
    getApprovedRollNumbers: function () {
      return getStored(STORAGE_KEYS.APPROVED_ROLLS) || [];
    },

    // 8. Get All Students (Admin)
    getAllStudents: function () {
      const students = getStored(STORAGE_KEYS.STUDENTS) || [];
      return students.map((s) => {
        const copy = { ...s };
        delete copy.password;
        return copy;
      });
    },

    // 9. Add Approved Roll Number (Admin)
    addApprovedRollNumber: function (rollData) {
      return new Promise((resolve, reject) => {
        const roll = (rollData.rollNumber || '').trim().toUpperCase();
        const regex = /^[0-9]{2}[A-Z]{3}[0-9]{4}$/;

        if (!regex.test(roll)) {
          reject(new Error('Invalid VIT Roll Number format (e.g. 24BCE1234).'));
          return;
        }

        const approvedList = getStored(STORAGE_KEYS.APPROVED_ROLLS) || [];
        if (approvedList.some((r) => r.rollNumber === roll)) {
          reject(new Error(`Roll number ${roll} already exists in approved registry.`));
          return;
        }

        const record = {
          rollNumber: roll,
          fullName: rollData.fullName || 'Approved Candidate',
          campus: rollData.campus || 'Vellore',
          department: rollData.department || 'Computer Science',
          degree: rollData.degree || 'B.Tech',
          batch: rollData.batch || '2024-2028',
          isRegistered: false,
          approvedBy: 'Administrator',
          approvedAt: new Date().toISOString().split('T')[0]
        };

        approvedList.push(record);
        setStored(STORAGE_KEYS.APPROVED_ROLLS, approvedList);
        appendLog('ADMIN_ADD_ROLL', { rollNumber: roll });
        resolve(record);
      });
    },

    // 10. Bulk Import Roll Numbers from CSV (Admin)
    bulkAddApprovedRollNumbers: function (rollList) {
      return new Promise((resolve) => {
        const approvedList = getStored(STORAGE_KEYS.APPROVED_ROLLS) || [];
        let addedCount = 0;
        let skippedCount = 0;

        rollList.forEach((item) => {
          const roll = (item.rollNumber || '').trim().toUpperCase();
          if (/^[0-9]{2}[A-Z]{3}[0-9]{4}$/.test(roll)) {
            if (!approvedList.some((r) => r.rollNumber === roll)) {
              approvedList.push({
                rollNumber: roll,
                fullName: item.fullName || 'Approved Candidate',
                campus: item.campus || 'Vellore',
                department: item.department || 'Engineering',
                degree: item.degree || 'B.Tech',
                batch: item.batch || '2024-2028',
                isRegistered: false,
                approvedBy: 'Bulk CSV Import',
                approvedAt: new Date().toISOString().split('T')[0]
              });
              addedCount++;
            } else {
              skippedCount++;
            }
          }
        });

        setStored(STORAGE_KEYS.APPROVED_ROLLS, approvedList);
        appendLog('ADMIN_BULK_CSV', { addedCount, skippedCount });
        resolve({ addedCount, skippedCount, total: approvedList.length });
      });
    },

    // 11. Delete / Invalidate Approved Roll Number (Admin)
    deleteApprovedRollNumber: function (rollNumber) {
      return new Promise((resolve, reject) => {
        const roll = rollNumber.trim().toUpperCase();
        let approvedList = getStored(STORAGE_KEYS.APPROVED_ROLLS) || [];
        const index = approvedList.findIndex((r) => r.rollNumber === roll);

        if (index === -1) {
          reject(new Error(`Roll number ${roll} not found.`));
          return;
        }

        approvedList.splice(index, 1);
        setStored(STORAGE_KEYS.APPROVED_ROLLS, approvedList);

        // Also clean up claims and students if any
        const claims = getStored(STORAGE_KEYS.CLAIMS) || {};
        delete claims[roll];
        setStored(STORAGE_KEYS.CLAIMS, claims);

        let students = getStored(STORAGE_KEYS.STUDENTS) || [];
        students = students.filter((s) => s.rollNumber !== roll);
        setStored(STORAGE_KEYS.STUDENTS, students);

        appendLog('ADMIN_DELETE_ROLL', { rollNumber: roll });
        resolve(true);
      });
    },

    // 12. Get Audit Logs
    getAuditLogs: function () {
      return getStored(STORAGE_KEYS.LOGS) || [];
    },

    // 13. Reset Demo Data
    resetDemoData: function () {
      localStorage.removeItem(STORAGE_KEYS.APPROVED_ROLLS);
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      localStorage.removeItem(STORAGE_KEYS.ADMINS);
      localStorage.removeItem(STORAGE_KEYS.CLAIMS);
      localStorage.removeItem(STORAGE_KEYS.LOGS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      initStorage();
      return true;
    },

    // 14. Save Custom Firebase Config (Optional Cloud Sync)
    saveFirebaseConfig: function (config) {
      setStored(STORAGE_KEYS.FIREBASE_CONFIG, config);
    },

    getFirebaseConfig: function () {
      return getStored(STORAGE_KEYS.FIREBASE_CONFIG);
    }
  };
})();
