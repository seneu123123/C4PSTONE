import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Unlock, 
  Trash2, 
  UserPlus, 
  Search, 
  Filter, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  Eye, 
  EyeOff, 
  Check, 
  Sparkles,
  Mail,
  Send,
  Copy,
  Download,
  ShieldAlert,
  Fingerprint,
  FileSpreadsheet
} from 'lucide-react';
import { 
  StaffAccount, 
  StaffRole, 
  SubmoduleTab, 
  SecurityAuditLog, 
  GranularPermission 
} from '../../types';
import { 
  getStoredStaffAccounts, 
  saveStaffAccounts, 
  getStoredAuditLogs, 
  logSecurityEvent, 
  getRoleBadgeStyle,
  ROLE_DEFAULT_TABS,
  ROLE_DEFAULT_PERMISSIONS,
  TAB_DISPLAY_NAMES,
  DEFAULT_PASSWORD_VALUE,
  verifyAuditChain,
  getSuperAdminOtpRemainingMs,
  isSuperAdminOtpAuthorized,
  grantSuperAdminOtpSession,
  revokeSuperAdminOtpSession,
  SUPER_ADMIN_OTP_SESSION_DURATION_MS
} from '../../utils/rbac';
import { 
  generateEmailOtpCode,
  EmailVerificationSession,
  generateBackupCodes
} from '../../utils/cryptoAuth';
import { SuperAdminOtpChallengeModal } from '../admin/SuperAdminOtpChallengeModal';
import { SuperAdminOtpWindowBanner } from '../admin/SuperAdminOtpWindowBanner';

interface UserRbacManagementProps {
  currentAdminEmail: string;
  currentAdminRole: string;
}

const ALL_ROLES: StaffRole[] = [
  'Super Admin',
  'Tour Operations Manager',
  'Finance Officer',
  'Tour Guide',
  'Custom Staff'
];

const ALL_TABS: SubmoduleTab[] = [
  'overview',
  'packages',
  'bookings',
  'itineraries',
  'reservations',
  'payments',
  'feedback',
  'settings',
  'rbac'
];

const GRANULAR_PERMISSION_CATEGORIES: {
  category: string;
  permissions: { key: GranularPermission; label: string; desc: string }[];
}[] = [
  {
    category: 'Tour Packages & Inventory',
    permissions: [
      { key: 'packages.view', label: 'View Packages', desc: 'Browse catalog, pricing, and itinerary routes' },
      { key: 'packages.create', label: 'Create Packages', desc: 'Author and publish new tour packages' },
      { key: 'packages.edit', label: 'Edit Packages', desc: 'Modify rates, inclusions, and flight/tour schedules' },
      { key: 'packages.delete', label: 'Delete Packages', desc: 'Archive or permanently remove package offerings' }
    ]
  },
  {
    category: 'Bookings & Passenger Manifests',
    permissions: [
      { key: 'bookings.view_manifest', label: 'View Manifest', desc: 'Inspect passenger names, contact info, and special requests' },
      { key: 'bookings.update_status', label: 'Update Status', desc: 'Confirm, reschedule, or cancel guest reservations' },
      { key: 'bookings.export_csv', label: 'Export Passenger Manifest', desc: 'Download aviation and security manifest CSV rosters' },
      { key: 'bookings.delete', label: 'Purge Bookings', desc: 'Permanently remove cancelled bookings' }
    ]
  },
  {
    category: 'Logistics, Guides & Transport',
    permissions: [
      { key: 'logistics.dispatch_guide', label: 'Dispatch Guides', desc: 'Assign accredited tour guides to daily departures' },
      { key: 'logistics.manage_hotels', label: 'Manage Accommodations', desc: 'Allocate hotel rooms, check-ins, and vouchers' },
      { key: 'logistics.manage_transport', label: 'Manage Airlines & Shuttles', desc: 'Coordinate flight reservations, airport shuttles, and executive vans' }
    ]
  },
  {
    category: 'Fiscal, Payments & Invoicing',
    permissions: [
      { key: 'finance.view_payments', label: 'Inspect Transactions', desc: 'View ledger, GCash/Maya receipts, and bank wires' },
      { key: 'finance.verify_payment', label: 'Verify Payments', desc: 'Reconcile merchant reference codes and approve receipts' },
      { key: 'finance.issue_refund', label: 'Authorize Refunds', desc: 'Disburse partial or total refunds for weather cancellations' },
      { key: 'finance.export_invoices', label: 'Export BIR Invoices', desc: 'Generate official tax and invoice summaries' }
    ]
  },
  {
    category: 'Customer Reviews & Feedback',
    permissions: [
      { key: 'feedback.view', label: 'Read Guest Feedback', desc: 'View star ratings, NPS scores, and survey comments' },
      { key: 'feedback.moderate', label: 'Moderate Feedback', desc: 'Feature verified testimonials or hide inappropriate reviews' }
    ]
  },
  {
    category: 'Administrative & RBAC Governance',
    permissions: [
      { key: 'rbac.view_staff', label: 'View Staff Directory', desc: 'Inspect authorized employee roster and roles' },
      { key: 'rbac.create_staff', label: 'Provision Accounts', desc: 'Create independent employee logins' },
      { key: 'rbac.edit_roles', label: 'Modify Clearances', desc: 'Reassign operational roles and permissions' },
      { key: 'rbac.reset_passwords', label: 'Reset Credentials', desc: 'Override staff passwords and reissue 2FA tokens' },
      { key: 'rbac.delete_staff', label: 'Revoke Accounts', desc: 'Permanently decommission staff clearances' },
      { key: 'rbac.view_audit_logs', label: 'Inspect Audit Trail', desc: 'Review cryptographic ISO 27001 tamper-evident logs' }
    ]
  }
];

export const UserRbacManagement: React.FC<UserRbacManagementProps> = ({
  currentAdminEmail,
  currentAdminRole
}) => {
  const [accounts, setAccounts] = useState<StaffAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [activeTabSubView, setActiveTabSubView] = useState<'accounts' | 'matrix' | 'capabilities' | 'twofactor' | 'audit'>('accounts');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Selected Account for Modals
  const [selectedAccount, setSelectedAccount] = useState<StaffAccount | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isGranularModalOpen, setIsGranularModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Form State: Add Account
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<StaffRole>('Tour Operations Manager');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newAllowedTabs, setNewAllowedTabs] = useState<SubmoduleTab[]>(ROLE_DEFAULT_TABS['Tour Operations Manager']);
  const [newGranularPerms, setNewGranularPerms] = useState<GranularPermission[]>(ROLE_DEFAULT_PERMISSIONS['Tour Operations Manager']);

  // Form State: Change Password
  const [updatedPassword, setUpdatedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dual-Control Super Admin Verification Password for high-risk actions
  const [superAdminVerificationPassword, setSuperAdminVerificationPassword] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Super Admin 2-Minute OTP Window & Step-Up Challenge State
  const [otpRemainingMs, setOtpRemainingMs] = useState<number>(() => 
    getSuperAdminOtpRemainingMs(currentAdminEmail)
  );
  const [isOtpChallengeOpen, setIsOtpChallengeOpen] = useState(false);
  const [pendingSuperAdminAction, setPendingSuperAdminAction] = useState<{
    title: string;
    description: string;
    actionFn: () => void | Promise<void>;
  } | null>(null);

  // Notice Banner
  const [feedbackNotice, setFeedbackNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Audit Integrity State
  const [chainIntegrity, setChainIntegrity] = useState<{ verified: boolean; checkedCount: number; message: string } | null>(null);

  // Email Dispatch Test state
  const [testEmailSession, setTestEmailSession] = useState<EmailVerificationSession | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // 1-Second countdown tick for on-screen 2-minute window
  useEffect(() => {
    const tick = () => {
      const remaining = getSuperAdminOtpRemainingMs(currentAdminEmail);
      setOtpRemainingMs(remaining);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [currentAdminEmail]);

  // Unified Super Admin Action Gatekeeper
  const executeSuperAdminAction = (
    title: string,
    description: string,
    actionFn: () => void | Promise<void>
  ) => {
    if (isSuperAdminOtpAuthorized(currentAdminEmail)) {
      // 2-minute lease active! Execute immediately
      actionFn();
    } else {
      // Require 6-digit OTP step-up challenge
      setPendingSuperAdminAction({ title, description, actionFn });
      setIsOtpChallengeOpen(true);
    }
  };

  const handleOtpChallengeSuccess = () => {
    grantSuperAdminOtpSession(currentAdminEmail, SUPER_ADMIN_OTP_SESSION_DURATION_MS);
    setOtpRemainingMs(SUPER_ADMIN_OTP_SESSION_DURATION_MS);
    if (pendingSuperAdminAction?.actionFn) {
      const fn = pendingSuperAdminAction.actionFn;
      setPendingSuperAdminAction(null);
      fn();
    }
    showNotice('Super Admin OTP verified. 2-Minute operational window activated.');
  };

  const handleLockSuperAdminSession = () => {
    revokeSuperAdminOtpSession(currentAdminEmail);
    setOtpRemainingMs(0);
    showNotice('Super Admin session locked. Future administrative actions will require an OTP.');
  };

  const handlePromptOtpWindow = (title: string, description: string, actionFn: () => void) => {
    executeSuperAdminAction(title, description, actionFn);
  };

  // Initial Load & Refresh
  const reloadData = () => {
    setAccounts(getStoredStaffAccounts());
    setAuditLogs(getStoredAuditLogs());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedbackNotice({ message, type });
    setTimeout(() => {
      setFeedbackNotice(null);
    }, 4500);
  };

  const resetAddForm = () => {
    setNewFullName('');
    setNewEmail('');
    setNewRole('Tour Operations Manager');
    setNewPassword('');
    setNewPhone('');
    setNewNotes('');
    setNewAllowedTabs(ROLE_DEFAULT_TABS['Tour Operations Manager']);
    setNewGranularPerms(ROLE_DEFAULT_PERMISSIONS['Tour Operations Manager']);
  };

  // 1. Create Independent Staff Account (Protected via 2-minute Super Admin OTP)
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFullName.trim() || !newEmail.trim()) {
      showNotice('Please provide full name and official email.', 'error');
      return;
    }

    const normEmail = newEmail.trim().toLowerCase();
    const existing = accounts.find((a) => a.email.toLowerCase() === normEmail);
    if (existing) {
      showNotice(`An account with email ${normEmail} already exists.`, 'error');
      return;
    }

    executeSuperAdminAction(
      'Provision Staff Account',
      `Provisioning independent staff account "${newFullName}" (${normEmail}) with role "${newRole}".`,
      async () => {
        const backupCodes = generateBackupCodes(5);

        const newAccount: StaffAccount = {
          id: `staff-${Date.now()}`,
          fullName: newFullName.trim(),
          email: normEmail,
          role: newRole,
          password: newPassword.trim() || DEFAULT_PASSWORD_VALUE,
          status: 'Active',
          createdAt: new Date().toISOString(),
          allowedTabs: newAllowedTabs,
          granularPermissions: newGranularPerms,
          twoFactorEnabled: true,
          backupCodes,
          phoneNumber: newPhone.trim() || undefined,
          notes: newNotes.trim() || undefined
        };

        const updated = [newAccount, ...accounts];
        saveStaffAccounts(updated);
        setAccounts(updated);

        await logSecurityEvent(
          currentAdminEmail,
          'USER_PROVISIONED',
          `Super Admin provisioned staff account "${newAccount.fullName}" (${newAccount.email}) with role clearance "${newAccount.role}". Protected with Email 2FA (6-digit code verification).`,
          'info',
          newAccount.email
        );

        setAuditLogs(getStoredAuditLogs());
        setIsAddModalOpen(false);
        resetAddForm();
        showNotice(`Staff account for ${newAccount.fullName} successfully cleared with commercial RBAC policies.`);
      }
    );
  };

  // 2. Change Role (Protected via 2-minute Super Admin OTP)
  const handleChangeRole = async (account: StaffAccount, newRole: StaffRole) => {
    if (account.email === 'karlljacob8@gmail.com') {
      showNotice('The Root Super Administrator clearance cannot be downgraded.', 'error');
      return;
    }

    executeSuperAdminAction(
      'Reassign Staff Role',
      `Reassigning operational clearance for ${account.fullName} (${account.email}) to "${newRole}".`,
      async () => {
        const defaultTabs = ROLE_DEFAULT_TABS[newRole] || ROLE_DEFAULT_TABS['Custom Staff'];
        const defaultPerms = ROLE_DEFAULT_PERMISSIONS[newRole] || ROLE_DEFAULT_PERMISSIONS['Custom Staff'];

        const updated = accounts.map((acc) => {
          if (acc.id === account.id) {
            return {
              ...acc,
              role: newRole,
              allowedTabs: defaultTabs,
              granularPermissions: defaultPerms
            };
          }
          return acc;
        });

        saveStaffAccounts(updated);
        setAccounts(updated);

        await logSecurityEvent(
          currentAdminEmail,
          'ROLE_REASSIGNED',
          `Reassigned clearance for ${account.fullName} from "${account.role}" to "${newRole}". Submodule permissions synchronized.`,
          'warning',
          account.email
        );

        setAuditLogs(getStoredAuditLogs());
        showNotice(`Clearance updated: ${account.fullName} is now ${newRole}.`);
      }
    );
  };

  // 3. Toggle Status (Active / Suspended) (Protected via 2-minute Super Admin OTP)
  const handleToggleStatus = async (account: StaffAccount) => {
    if (account.email === 'karlljacob8@gmail.com') {
      showNotice('Root Super Administrator account cannot be suspended.', 'error');
      return;
    }

    const newStatus: 'Active' | 'Suspended' = account.status === 'Active' ? 'Suspended' : 'Active';

    executeSuperAdminAction(
      newStatus === 'Suspended' ? 'Suspend Staff Account' : 'Activate Staff Account',
      `Transitioning staff access for ${account.fullName} (${account.email}) to "${newStatus}".`,
      async () => {
        const updated = accounts.map((acc) => {
          if (acc.id === account.id) {
            return {
              ...acc,
              status: newStatus
            };
          }
          return acc;
        });

        saveStaffAccounts(updated);
        setAccounts(updated);

        await logSecurityEvent(
          currentAdminEmail,
          newStatus === 'Suspended' ? 'ACCOUNT_SUSPENDED' : 'ACCOUNT_ACTIVATED',
          `Staff access for ${account.fullName} (${account.email}) transitioned to ${newStatus}.`,
          newStatus === 'Suspended' ? 'critical' : 'info',
          account.email
        );

        setAuditLogs(getStoredAuditLogs());
        showNotice(`Account for ${account.fullName} marked as ${newStatus}.`);
      }
    );
  };

  // 4. Change Password (Protected via 2-minute Super Admin OTP)
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;

    if (!updatedPassword || updatedPassword.length < 6) {
      showNotice('Password must be at least 6 characters.', 'error');
      return;
    }

    executeSuperAdminAction(
      'Reset Staff Password',
      `Overriding authentication passphrase for ${selectedAccount.fullName} (${selectedAccount.email}).`,
      async () => {
        const updated = accounts.map((acc) => {
          if (acc.id === selectedAccount.id) {
            return {
              ...acc,
              password: updatedPassword
            };
          }
          return acc;
        });

        saveStaffAccounts(updated);
        setAccounts(updated);

        await logSecurityEvent(
          currentAdminEmail,
          'CREDENTIALS_OVERRIDDEN',
          `Super Admin forced password update for staff member ${selectedAccount.fullName} (${selectedAccount.email}).`,
          'warning',
          selectedAccount.email
        );

        setAuditLogs(getStoredAuditLogs());
        setIsPasswordModalOpen(false);
        setSelectedAccount(null);
        setUpdatedPassword('');
        showNotice(`New authentication credentials established for ${selectedAccount.fullName}.`);
      }
    );
  };

  // 5. Delete Account (Protected via 2-minute Super Admin OTP)
  const handleConfirmDelete = async () => {
    if (!selectedAccount) return;

    if (selectedAccount.email === 'karlljacob8@gmail.com') {
      showNotice('Root Super Administrator account cannot be revoked.', 'error');
      setIsDeleteModalOpen(false);
      return;
    }

    executeSuperAdminAction(
      'Permanently Revoke Staff Account',
      `Permanently revoking all clearances and deleting credentials for ${selectedAccount.fullName} (${selectedAccount.email}).`,
      async () => {
        const updated = accounts.filter((acc) => acc.id !== selectedAccount.id);
        saveStaffAccounts(updated);
        setAccounts(updated);

        await logSecurityEvent(
          currentAdminEmail,
          'USER_REVOKED',
          `Permanent revocation of staff account: ${selectedAccount.fullName} (${selectedAccount.email}), role: ${selectedAccount.role}. Cleared by Super Admin OTP dual-authorization.`,
          'critical',
          selectedAccount.email
        );

        setAuditLogs(getStoredAuditLogs());
        setIsDeleteModalOpen(false);
        setSelectedAccount(null);
        setSuperAdminVerificationPassword('');
        setVerificationError(null);
        showNotice(`Staff credentials for ${selectedAccount.fullName} permanently revoked.`);
      }
    );
  };

  // 6. Save Custom Submodule Permissions (Protected via 2-minute Super Admin OTP)
  const handleSaveCustomPermissions = async (tabs: SubmoduleTab[]) => {
    if (!selectedAccount) return;

    executeSuperAdminAction(
      'Modify Submodule Screen Permissions',
      `Customizing authorized submodules (${tabs.length} tabs) for ${selectedAccount.fullName}.`,
      async () => {
        const updated = accounts.map((acc) => {
          if (acc.id === selectedAccount.id) {
            return {
              ...acc,
              allowedTabs: tabs
            };
          }
          return acc;
        });

        saveStaffAccounts(updated);
        setAccounts(updated);

        await logSecurityEvent(
          currentAdminEmail,
          'PERMISSIONS_CUSTOMIZED',
          `Super Admin customized submodule access for ${selectedAccount.fullName}: ${tabs.join(', ')}.`,
          'warning',
          selectedAccount.email
        );

        setAuditLogs(getStoredAuditLogs());
        setIsPermissionsModalOpen(false);
        setSelectedAccount(null);
        showNotice(`Submodule permissions updated for ${selectedAccount.fullName}.`);
      }
    );
  };

  // 7. Save Granular Capabilities (Protected via 2-minute Super Admin OTP)
  const handleSaveGranularPermissions = async (perms: GranularPermission[]) => {
    if (!selectedAccount) return;

    executeSuperAdminAction(
      'Modify Granular Capability Matrix',
      `Customizing ${perms.length} fine-grained permissions for ${selectedAccount.fullName}.`,
      async () => {
        const updated = accounts.map((acc) => {
          if (acc.id === selectedAccount.id) {
            return {
              ...acc,
              granularPermissions: perms
            };
          }
          return acc;
        });

        saveStaffAccounts(updated);
        setAccounts(updated);

        await logSecurityEvent(
          currentAdminEmail,
          'GRANULAR_CAPABILITIES_MODIFIED',
          `Super Admin customized ${perms.length} granular capabilities for ${selectedAccount.fullName}.`,
          'warning',
          selectedAccount.email
        );

        setAuditLogs(getStoredAuditLogs());
        setIsGranularModalOpen(false);
        setSelectedAccount(null);
        showNotice(`Granular capability matrix updated for ${selectedAccount.fullName}.`);
      }
    );
  };

  // 8. Regenerate 2FA Backup Codes (Protected via 2-minute Super Admin OTP)
  const handleRegenerateBackupCodes = async (account: StaffAccount) => {
    executeSuperAdminAction(
      'Re-issue 2FA Emergency Backup Codes',
      `Generating 5 new emergency 2FA backup recovery codes for ${account.fullName}.`,
      async () => {
        const newCodes = generateBackupCodes(5);
        const updated = accounts.map((acc) => {
          if (acc.id === account.id) {
            return {
              ...acc,
              backupCodes: newCodes
            };
          }
          return acc;
        });

        saveStaffAccounts(updated);
        setAccounts(updated);

        await logSecurityEvent(
          currentAdminEmail,
          '2FA_BACKUP_CODES_REGENERATED',
          `Super Admin generated 5 new emergency 2FA backup recovery codes for ${account.fullName}.`,
          'warning',
          account.email
        );

        setAuditLogs(getStoredAuditLogs());
        showNotice(`New emergency backup recovery codes generated for ${account.fullName}.`);
      }
    );
  };

  // 9. Dispatch Test Email 2FA Code via Email Composer (Protected via 2-minute Super Admin OTP)
  const handleTestDispatchEmailOtp = async (account: StaffAccount) => {
    executeSuperAdminAction(
      'Dispatch 6-Digit Email OTP',
      `Dispatching test 6-digit authentication code to ${account.email}.`,
      async () => {
        setSelectedAccount(account);
        const session = generateEmailOtpCode(account.email);
        setTestEmailSession(session);
        setIsQrModalOpen(true);

        await logSecurityEvent(
          currentAdminEmail,
          '2FA_CODE_DISPATCHED',
          `Super Admin triggered test 6-digit Email 2FA code dispatch for ${account.fullName} (${account.email}).`,
          'info',
          account.email
        );

        setAuditLogs(getStoredAuditLogs());
        showNotice(`Single-use 6-digit authorization code dispatched to ${account.email}.`);
      }
    );
  };

  // 11. Run Cryptographic Hash Chain Audit Integrity Verification
  const handleVerifyChain = async () => {
    const result = await verifyAuditChain(auditLogs);
    setChainIntegrity({
      verified: result.valid,
      checkedCount: auditLogs.length,
      message: result.valid
        ? `Cryptographic Hash Chain Verified: All ${auditLogs.length} audit records adhere to unbroken SHA-256 genesis chaining.`
        : `Integrity Alert: Chain validation discrepancy detected at record index ${result.brokenAtIndex ?? 'unknown'}.`
    });
  };

  // 12. Export Audit Logs as CSV
  const handleExportAuditCsv = () => {
    const headers = ['ID', 'Timestamp', 'Actor Email', 'Action', 'Target Email', 'Severity', 'Details', 'Prev Hash', 'Block Hash'];
    const rows = auditLogs.map((log) => [
      log.id,
      log.timestamp,
      log.actorEmail,
      log.action,
      log.targetEmail || 'N/A',
      log.severity,
      `"${(log.details || '').replace(/"/g, '""')}"`,
      log.prevHash || 'GENESIS',
      log.hash || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `holiday_travelers_iso27001_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('Security audit log exported as ISO/IEC 27001 CSV.');
  };

  // Filter accounts
  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch = 
      acc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || acc.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const isSuperAdmin = currentAdminRole === 'Super Admin' || currentAdminEmail === 'karlljacob8@gmail.com';

  return (
    <div className="space-y-8 animate-fade-in font-sans-body">
      {/* Top Banner & Title */}
      <div className="bg-[#0B1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Commercial ISO/IEC 27001 RBAC Governance
              </span>
              <span className="text-sand-muted text-xs">•</span>
              <span className="text-sand-muted text-xs">Email 2-Factor Authenticated (6-Digit OTP)</span>
              <span className="text-sand-muted text-xs">•</span>
              <span className="text-sand-muted text-xs font-mono">Zero-Trust Role Segregation</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-ivory font-light tracking-wide">
              Staff & RBAC Governance Center
            </h2>
            <p className="text-sm text-sand-muted max-w-3xl font-light leading-relaxed">
              Commercial-grade access governance for Holiday Travelers. Super Administrators maintain absolute control over staff identities, custom role assignments, fine-grained capability matrices, Email 2FA 6-digit authorization codes, and tamper-evident SHA-256 audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isSuperAdmin && (
              <button
                onClick={() => {
                  resetAddForm();
                  setIsAddModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-full bg-sunset-coral hover:bg-[#ff765b] text-white font-semibold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-sunset-coral/25 transition-all active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Staff Account</span>
              </button>
            )}
            <button
              onClick={reloadData}
              className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-sand-muted hover:text-ivory border border-white/10 transition-colors"
              title="Refresh Accounts and Audit Logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Super Admin 2-Minute OTP Lease Window Banner */}
        {isSuperAdmin && (
          <div className="mt-5">
            <SuperAdminOtpWindowBanner
              remainingMs={otpRemainingMs}
              adminEmail={currentAdminEmail}
              onUnlockNow={() => {
                handlePromptOtpWindow(
                  'Super Admin Session Pre-Authorization',
                  'Verify 6-digit OTP to open a 2-minute unrestricted Super Admin operational window.',
                  () => {}
                );
              }}
              onLockNow={handleLockSuperAdminSession}
            />
          </div>
        )}

        {/* Global Notice Pill */}
        {feedbackNotice && (
          <div 
            className={`mt-4 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs animate-fade-in border ${
              feedbackNotice.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {feedbackNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{feedbackNotice.message}</span>
          </div>
        )}

        {/* Sub-view Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/[0.08] overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTabSubView('accounts')}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap ${
              activeTabSubView === 'accounts'
                ? 'bg-white/10 text-ivory border border-white/20 shadow-md'
                : 'text-sand-muted hover:text-ivory hover:bg-white/[0.04]'
            }`}
          >
            Staff Directory ({accounts.length})
          </button>
          <button
            onClick={() => setActiveTabSubView('matrix')}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap ${
              activeTabSubView === 'matrix'
                ? 'bg-white/10 text-ivory border border-white/20 shadow-md'
                : 'text-sand-muted hover:text-ivory hover:bg-white/[0.04]'
            }`}
          >
            Submodule Matrix
          </button>
          <button
            onClick={() => setActiveTabSubView('capabilities')}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTabSubView === 'capabilities'
                ? 'bg-white/10 text-ivory border border-white/20 shadow-md'
                : 'text-sand-muted hover:text-ivory hover:bg-white/[0.04]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sunset-coral" />
            <span>Granular Capability Matrix</span>
          </button>
          <button
            onClick={() => setActiveTabSubView('twofactor')}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTabSubView === 'twofactor'
                ? 'bg-white/10 text-ivory border border-white/20 shadow-md'
                : 'text-sand-muted hover:text-ivory hover:bg-white/[0.04]'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>Email 2FA Codes</span>
          </button>
          <button
            onClick={() => setActiveTabSubView('audit')}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTabSubView === 'audit'
                ? 'bg-white/10 text-ivory border border-white/20 shadow-md'
                : 'text-sand-muted hover:text-ivory hover:bg-white/[0.04]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Security Audit Trail ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: STAFF DIRECTORY & CONTROLS                                    */}
      {/* ========================================================================= */}
      {activeTabSubView === 'accounts' && (
        <div className="space-y-6">
          {/* Filter / Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#090E14] p-4 rounded-2xl border border-white/[0.08]">
            <div className="flex items-center gap-2.5 w-full sm:w-80 px-3.5 py-2 bg-[#070B0E] rounded-xl border border-white/10 focus-within:border-sunset-coral transition-colors">
              <Search className="w-4 h-4 text-sand-muted shrink-0" />
              <input
                type="text"
                placeholder="Search staff by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-ivory placeholder-sand-muted focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-sand-muted" />
              <span className="text-xs text-sand-muted">Filter Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-[#070B0E] border border-white/10 text-xs text-ivory rounded-xl px-3 py-1.5 focus:outline-none focus:border-sunset-coral"
              >
                <option value="all">All Roles ({accounts.length})</option>
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Accounts Grid / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredAccounts.map((account) => {
              const badge = getRoleBadgeStyle(account.role);
              const isRootAdmin = account.email === 'karlljacob8@gmail.com';
              const isCurrentSessionUser = account.email.toLowerCase() === currentAdminEmail.toLowerCase();
              const allowedTabsList = account.allowedTabs || ROLE_DEFAULT_TABS[account.role] || [];
              const permsList = account.granularPermissions || ROLE_DEFAULT_PERMISSIONS[account.role] || [];

              return (
                <div 
                  key={account.id}
                  className={`bg-[#0B1014] border rounded-3xl p-6 transition-all hover:border-white/20 relative overflow-hidden flex flex-col justify-between ${
                    account.status === 'Suspended' 
                      ? 'border-red-900/30 opacity-75' 
                      : 'border-white/[0.08]'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header: Avatar, Name, Role Badge, Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div 
                          className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm border shadow-lg"
                          style={{
                            backgroundColor: 'rgba(var(--admin-accent-rgb, 242, 106, 79), 0.15)',
                            borderColor: 'rgba(var(--admin-accent-rgb, 242, 106, 79), 0.3)',
                            color: 'var(--admin-accent, #F26A4F)'
                          }}
                        >
                          {account.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-ivory text-sm tracking-wide">
                              {account.fullName}
                            </h4>
                            {isCurrentSessionUser && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-sand-muted font-mono">{account.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}>
                          {account.role}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span 
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                              account.status === 'Active' 
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                                : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                            }`}
                          >
                            {account.status}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                            <Mail className="w-2.5 h-2.5" /> Email 2FA
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Notes / Responsibilities */}
                    {account.notes && (
                      <p className="text-xs text-sand-muted/90 font-light leading-relaxed bg-[#070B0E] p-3 rounded-xl border border-white/[0.04]">
                        {account.notes}
                      </p>
                    )}

                    {/* Capabilities Summary */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-[#070B0E] p-2.5 rounded-xl border border-white/[0.04] space-y-1">
                        <span className="text-[10px] text-sand-muted uppercase font-mono">Submodules</span>
                        <div className="text-xs font-semibold text-ivory font-mono">
                          {allowedTabsList.length} / {ALL_TABS.length} Active
                        </div>
                      </div>
                      <div className="bg-[#070B0E] p-2.5 rounded-xl border border-white/[0.04] space-y-1">
                        <span className="text-[10px] text-sand-muted uppercase font-mono">Granular Actions</span>
                        <div className="text-xs font-semibold text-sunset-coral font-mono">
                          {permsList.length} Capabilities
                        </div>
                      </div>
                    </div>

                    {/* Account Metadata */}
                    <div className="flex items-center justify-between text-[10px] text-sand-muted/70 font-mono pt-2 border-t border-white/[0.04]">
                      <span>Added: {new Date(account.createdAt).toLocaleDateString()}</span>
                      <span>Security: Tier-1 Protected</span>
                      <span>Last Seen: {account.lastLogin ? new Date(account.lastLogin).toLocaleDateString() : 'Pending'}</span>
                    </div>
                  </div>

                  {/* Super Admin Control Buttons */}
                  {isSuperAdmin && (
                    <div className="pt-5 mt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
                      {/* Left: Quick Role Selector */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-sand-muted">Role:</span>
                        <select
                          value={account.role}
                          disabled={isRootAdmin}
                          onChange={(e) => handleChangeRole(account, e.target.value as StaffRole)}
                          className="bg-[#070B0E] border border-white/10 text-[11px] text-ivory rounded-lg px-2.5 py-1 focus:outline-none focus:border-sunset-coral disabled:opacity-50"
                        >
                          {ALL_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          onClick={() => {
                            setSelectedAccount(account);
                            setUpdatedPassword('');
                            setIsPasswordModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-sand-muted hover:text-ivory border border-white/10 transition-colors"
                          title="Change Staff Password"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedAccount(account);
                            setIsPermissionsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-sand-muted hover:text-ivory border border-white/10 transition-colors"
                          title="Customize Submodule Permissions"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedAccount(account);
                            setIsGranularModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-sand-muted hover:text-sunset-coral border border-white/10 transition-colors"
                          title="Customize Granular Capabilities Matrix"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleTestDispatchEmailOtp(account)}
                          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-sand-muted hover:text-cyan-400 border border-white/10 transition-colors"
                          title="Dispatch Test Email 2FA Code"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>

                        {!isRootAdmin && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(account)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                account.status === 'Active'
                                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20'
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                              }`}
                              title={account.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                            >
                              {account.status === 'Active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => {
                                setSelectedAccount(account);
                                setSuperAdminVerificationPassword('');
                                setVerificationError(null);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                              title="Delete Account (Dual-Control Authorized)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: SUBMODULE AUTHORIZATION MATRIX                                */}
      {/* ========================================================================= */}
      {activeTabSubView === 'matrix' && (
        <div className="bg-[#0B1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-x-auto">
          <div className="space-y-1">
            <h3 className="font-serif-display text-2xl text-ivory font-light">
              Hierarchical Submodule Authorization Matrix
            </h3>
            <p className="text-xs text-sand-muted font-light">
              High-level screen and navigation routing clearances assigned by designated operator role.
            </p>
          </div>

          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 text-sand-muted font-mono">
                <th className="py-3 px-4 uppercase tracking-wider">Submodule / Operations Screen</th>
                <th className="py-3 px-3 text-rose-400">Super Admin</th>
                <th className="py-3 px-3 text-sunset-coral">Ops Manager</th>
                <th className="py-3 px-3 text-emerald-400">Finance Officer</th>
                <th className="py-3 px-3 text-cyan-400">Tour Guide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {ALL_TABS.map((tab) => {
                const superHas = ROLE_DEFAULT_TABS['Super Admin'].includes(tab);
                const opsHas = ROLE_DEFAULT_TABS['Tour Operations Manager'].includes(tab);
                const finHas = ROLE_DEFAULT_TABS['Finance Officer'].includes(tab);
                const guideHas = ROLE_DEFAULT_TABS['Tour Guide'].includes(tab);

                return (
                  <tr key={tab} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-ivory font-medium">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sunset-coral/50" />
                        <span>{TAB_DISPLAY_NAMES[tab]}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {superHas ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3" /> Full Root
                        </span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {opsHas ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3" /> Granted
                        </span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {finHas ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3" /> Granted
                        </span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {guideHas ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3" /> Field Only
                        </span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: GRANULAR CAPABILITY MATRIX                                    */}
      {/* ========================================================================= */}
      {activeTabSubView === 'capabilities' && (
        <div className="space-y-6">
          <div className="bg-[#0B1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif-display text-2xl text-ivory font-light">
                  Fine-Grained Capability Matrix
                </h3>
                <p className="text-xs text-sand-muted font-light mt-1">
                  Enforce least-privilege security by checking which operator roles are authorized for granular mutations and sensitive exports.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-sunset-coral/10 border border-sunset-coral/30 text-sunset-coral font-mono text-xs">
                Zero-Trust Action Level
              </span>
            </div>

            <div className="space-y-6">
              {GRANULAR_PERMISSION_CATEGORIES.map((cat) => (
                <div key={cat.category} className="bg-[#070B0E] p-5 rounded-2xl border border-white/[0.06] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ivory font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sunset-coral" />
                    {cat.category}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cat.permissions.map((perm) => (
                      <div key={perm.key} className="p-3 bg-[#0B1014] rounded-xl border border-white/[0.04] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-ivory">{perm.label}</span>
                          <span className="text-[10px] font-mono text-sand-muted">{perm.key}</span>
                        </div>
                        <p className="text-[11px] text-sand-muted leading-relaxed font-light">
                          {perm.desc}
                        </p>
                        <div className="flex items-center gap-1.5 pt-1">
                          {ALL_ROLES.filter((r) => r !== 'Custom Staff').map((r) => {
                            const has = ROLE_DEFAULT_PERMISSIONS[r]?.includes(perm.key);
                            return (
                              <span 
                                key={r} 
                                className={`text-[9px] px-2 py-0.5 rounded font-mono ${
                                  has ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-white/[0.02] text-sand-muted/50'
                                }`}
                              >
                                {r.split(' ')[0]}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: EMAIL 2FA 6-DIGIT CODE GOVERNANCE                             */}
      {/* ========================================================================= */}
      {activeTabSubView === 'twofactor' && (
        <div className="bg-[#0B1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-display text-2xl text-ivory font-light">
                Enterprise Email 2-Factor Authentication Governance
              </h3>
              <p className="text-xs text-sand-muted font-light mt-1">
                Enforce and test 6-digit authorization codes dispatched via the Email Dispatch Composer for operator terminal clearance.
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              100% Email 2FA Enforcement
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="bg-[#070B0E] p-5 rounded-2xl border border-white/[0.08] space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-ivory text-sm">{account.fullName}</h4>
                    <p className="text-xs text-sand-muted font-mono">{account.email}</p>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email 2FA Active
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-[#0B1014] rounded-xl border border-white/[0.04]">
                    <span className="text-sand-muted">Dispatch Channel:</span>
                    <span className="font-mono text-cyan-300 font-medium">
                      Email Dispatch Composer (6-Digit OTP)
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#0B1014] rounded-xl border border-white/[0.04] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sand-muted">Emergency Backup Codes:</span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {account.backupCodes?.length || 5} Available
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(account.backupCodes || []).map((code) => (
                        <span key={code} className="text-[10px] font-mono px-2 py-0.5 bg-white/[0.04] text-ivory rounded border border-white/10">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
                  <button
                    onClick={() => handleTestDispatchEmailOtp(account)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Test 6-Digit Code</span>
                  </button>

                  <button
                    onClick={() => handleRegenerateBackupCodes(account)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-sand-muted hover:text-ivory border border-white/10 text-xs transition-colors"
                  >
                    Re-issue Backup Codes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 5: SECURITY AUDIT TRAIL (ISO/IEC 27001 WITH SHA-256 HASH CHAIN) */}
      {/* ========================================================================= */}
      {activeTabSubView === 'audit' && (
        <div className="bg-[#0B1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-serif-display text-2xl text-ivory font-light">
                Tamper-Evident Security Audit Logs (ISO/IEC 27001)
              </h3>
              <p className="text-xs text-sand-muted font-light">
                Each audit entry is cryptographically linked via SHA-256 genesis chaining to guarantee immutability.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleVerifyChain}
                className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-xs text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Verify SHA-256 Chain</span>
              </button>

              <button
                onClick={handleExportAuditCsv}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-xs text-sand-muted hover:text-ivory border border-white/10 flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Chain Integrity Alert Banner */}
          {chainIntegrity && (
            <div className={`p-4 rounded-2xl border text-xs flex items-center gap-3 animate-fade-in ${
              chainIntegrity.verified 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {chainIntegrity.verified ? <ShieldCheck className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
              <div>
                <div className="font-bold">Cryptographic Validation Report</div>
                <div className="text-[11px] opacity-90 mt-0.5">{chainIntegrity.message}</div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {auditLogs.map((log) => {
              let sevColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
              if (log.severity === 'warning') sevColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
              if (log.severity === 'critical') sevColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';

              return (
                <div 
                  key={log.id}
                  className="bg-[#070B0E] p-4 rounded-2xl border border-white/[0.06] flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] uppercase border ${sevColor}`}>
                        {log.action}
                      </span>
                      <span className="font-mono text-sand-muted text-[11px]">
                        by <strong className="text-ivory">{log.actorEmail}</strong>
                      </span>
                      {log.targetEmail && (
                        <span className="text-[11px] text-sunset-coral font-mono">
                          → {log.targetEmail}
                        </span>
                      )}
                    </div>
                    <p className="text-sand-muted font-light text-xs leading-relaxed">
                      {log.details}
                    </p>
                    {log.hash && (
                      <div className="text-[10px] font-mono text-sand-muted/60 flex items-center gap-2 pt-0.5">
                        <span>SHA-256 Hash: <strong className="text-sand-muted">{log.hash.substring(0, 16)}...{log.hash.substring(log.hash.length - 8)}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-sand-muted font-mono whitespace-nowrap sm:text-right shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE INDEPENDENT STAFF ACCOUNT                                */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-xl bg-[#0B1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sunset-coral/15 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display text-2xl text-ivory font-light">
                    Provision Staff Account
                  </h3>
                  <p className="text-xs text-sand-muted">
                    Create an independent account with customized role clearances and 2FA tokens.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-sand-muted hover:text-ivory transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ivory font-medium mb-1.5">Staff Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Santos"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070B0E] border border-white/10 rounded-xl text-ivory focus:outline-none focus:border-sunset-coral text-xs"
                  />
                </div>

                <div>
                  <label className="block text-ivory font-medium mb-1.5">Official Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@holidaytravelers.ph"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070B0E] border border-white/10 rounded-xl text-ivory focus:outline-none focus:border-sunset-coral text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ivory font-medium mb-1.5">Initial Password</label>
                  <input
                    type="password"
                    placeholder="Assign initial password (leave blank for system key)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070B0E] border border-white/10 rounded-xl text-ivory focus:outline-none focus:border-sunset-coral text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-ivory font-medium mb-1.5">Assigned Role Clearance *</label>
                  <select
                    value={newRole}
                    onChange={(e) => {
                      const role = e.target.value as StaffRole;
                      setNewRole(role);
                      setNewAllowedTabs(ROLE_DEFAULT_TABS[role]);
                      setNewGranularPerms(ROLE_DEFAULT_PERMISSIONS[role]);
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#070B0E] border border-white/10 rounded-xl text-ivory focus:outline-none focus:border-sunset-coral text-xs"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-ivory font-medium mb-1.5">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="+63 9XX XXX XXXX"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070B0E] border border-white/10 rounded-xl text-ivory focus:outline-none focus:border-sunset-coral text-xs"
                />
              </div>

              {/* Submodule Clearance Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-ivory font-semibold text-xs">
                  Authorized Submodules ({newAllowedTabs.length} Selected)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {ALL_TABS.map((tab) => {
                    const checked = newAllowedTabs.includes(tab);
                    return (
                      <label 
                        key={tab}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                          checked 
                            ? 'bg-sunset-coral/10 border-sunset-coral/30 text-ivory' 
                            : 'bg-[#070B0E] border-white/[0.06] text-sand-muted hover:border-white/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAllowedTabs([...newAllowedTabs, tab]);
                            } else {
                              setNewAllowedTabs(newAllowedTabs.filter((t) => t !== tab));
                            }
                          }}
                          className="rounded border-white/20 text-sunset-coral focus:ring-sunset-coral"
                        />
                        <span className="text-[11px]">{TAB_DISPLAY_NAMES[tab]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-ivory font-medium mb-1.5">Operational Role Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Assigned to Coron Island Hopping ground dispatch and transport coordination."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070B0E] border border-white/10 rounded-xl text-ivory focus:outline-none focus:border-sunset-coral text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sand-muted hover:text-ivory transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-sunset-coral hover:bg-[#ff765b] text-white font-semibold tracking-wider text-xs shadow-lg shadow-sunset-coral/25"
                >
                  Create & Clear Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CHANGE PASSWORD                                                 */}
      {/* ========================================================================= */}
      {isPasswordModalOpen && selectedAccount && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-[#0B1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto overscroll-contain my-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display text-2xl text-ivory font-light">
                    Reset Staff Password
                  </h3>
                  <p className="text-xs text-sand-muted font-mono">{selectedAccount.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-sand-muted hover:text-ivory transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sand-muted text-[11px] leading-relaxed">
                As Super Administrator, you are establishing new credentials for <strong>{selectedAccount.fullName}</strong>. Enter a new enterprise-grade passphrase below (minimum 6 characters).
              </div>

              <div>
                <label className="block text-ivory font-medium mb-1.5">New Password (min 6 chars) *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Enter secure password"
                    value={updatedPassword}
                    onChange={(e) => setUpdatedPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070B0E] border border-white/10 rounded-xl text-ivory focus:outline-none focus:border-sunset-coral pr-10 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-sand-muted hover:text-ivory"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-sand-muted hover:text-ivory transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold tracking-wider text-xs"
                >
                  Apply New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CUSTOMIZE SUBMODULE PERMISSIONS                                  */}
      {/* ========================================================================= */}
      {isPermissionsModalOpen && selectedAccount && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-[#0B1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto overscroll-contain my-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display text-2xl text-ivory font-light">
                    Submodule Screen Clearance
                  </h3>
                  <p className="text-xs text-sand-muted">{selectedAccount.fullName} ({selectedAccount.role})</p>
                </div>
              </div>
              <button
                onClick={() => setIsPermissionsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-sand-muted hover:text-ivory transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-sand-muted text-xs leading-relaxed">
                Check or uncheck specific submodules to adjust portal screen access for this staff member:
              </p>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {ALL_TABS.map((tab) => {
                  const currentAllowed = selectedAccount.allowedTabs || ROLE_DEFAULT_TABS[selectedAccount.role] || [];
                  const isChecked = currentAllowed.includes(tab);

                  return (
                    <label 
                      key={tab}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        isChecked 
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-ivory' 
                          : 'bg-[#070B0E] border-white/[0.06] text-sand-muted hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let updated: SubmoduleTab[];
                            if (e.target.checked) {
                              updated = [...currentAllowed, tab];
                            } else {
                              updated = currentAllowed.filter((t) => t !== tab);
                            }
                            setSelectedAccount({ ...selectedAccount, allowedTabs: updated });
                          }}
                          className="rounded border-white/20 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="font-medium">{TAB_DISPLAY_NAMES[tab]}</span>
                      </div>
                      <span className="font-mono text-[10px] text-sand-muted uppercase">
                        {tab}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPermissionsModalOpen(false)}
                  className="px-4 py-2 text-sand-muted hover:text-ivory transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCustomPermissions(selectedAccount.allowedTabs || [])}
                  className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold tracking-wider text-xs"
                >
                  Save Access Controls
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CUSTOMIZE GRANULAR CAPABILITIES                                  */}
      {/* ========================================================================= */}
      {isGranularModalOpen && selectedAccount && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-[#0B1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sunset-coral/15 border border-sunset-coral/30 flex items-center justify-center text-sunset-coral">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display text-2xl text-ivory font-light">
                    Granular Capabilities
                  </h3>
                  <p className="text-xs text-sand-muted">{selectedAccount.fullName} ({selectedAccount.role})</p>
                </div>
              </div>
              <button
                onClick={() => setIsGranularModalOpen(false)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-sand-muted hover:text-ivory transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-sand-muted text-xs leading-relaxed">
                Fine-tune explicit action clearances for this specific operator:
              </p>

              <div className="space-y-4">
                {GRANULAR_PERMISSION_CATEGORIES.map((cat) => {
                  const currentPerms = selectedAccount.granularPermissions || ROLE_DEFAULT_PERMISSIONS[selectedAccount.role] || [];
                  return (
                    <div key={cat.category} className="p-3.5 bg-[#070B0E] rounded-xl border border-white/[0.06] space-y-2.5">
                      <div className="font-mono text-ivory font-bold uppercase text-[11px]">
                        {cat.category}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cat.permissions.map((p) => {
                          const isChecked = currentPerms.includes(p.key);
                          return (
                            <label 
                              key={p.key}
                              className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                                isChecked 
                                  ? 'bg-sunset-coral/10 border-sunset-coral/30 text-ivory' 
                                  : 'bg-[#0B1014] border-white/[0.04] text-sand-muted hover:border-white/20'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  let updated: GranularPermission[];
                                  if (e.target.checked) {
                                    updated = [...currentPerms, p.key];
                                  } else {
                                    updated = currentPerms.filter((k) => k !== p.key);
                                  }
                                  setSelectedAccount({ ...selectedAccount, granularPermissions: updated });
                                }}
                                className="mt-0.5 rounded border-white/20 text-sunset-coral focus:ring-sunset-coral"
                              />
                              <div>
                                <div className="font-medium text-[11px]">{p.label}</div>
                                <div className="text-[10px] text-sand-muted">{p.desc}</div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsGranularModalOpen(false)}
                  className="px-4 py-2 text-sand-muted hover:text-ivory transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveGranularPermissions(selectedAccount.granularPermissions || [])}
                  className="px-6 py-2.5 rounded-full bg-sunset-coral hover:bg-[#ff765b] text-white font-semibold tracking-wider text-xs"
                >
                  Save Capability Matrix
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: EMAIL 2FA DISPATCH COMPOSER PREVIEW                              */}
      {/* ========================================================================= */}
      {isQrModalOpen && selectedAccount && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-[#0B1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto overscroll-contain my-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display text-2xl text-ivory font-light">
                    Email 2FA Dispatch Composer
                  </h3>
                  <p className="text-xs text-sand-muted">{selectedAccount.fullName} ({selectedAccount.email})</p>
                </div>
              </div>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-sand-muted hover:text-ivory transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Dispatch Simulated Envelope */}
            <div className="p-4 rounded-2xl bg-[#070C10] border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                  <Send className="w-3.5 h-3.5" />
                  <span>Outbound Authentication Dispatch</span>
                </div>
                <span className="text-[10px] font-mono text-sand-muted">
                  {testEmailSession?.dispatchedAt || 'Just now'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-sand-muted text-[11px]">
                  <span className="text-white/40 w-16 font-mono">From:</span>
                  <span className="text-ivory font-mono">security@holidaytravelers.ph</span>
                </div>
                <div className="flex items-center gap-2 text-sand-muted text-[11px]">
                  <span className="text-white/40 w-16 font-mono">To:</span>
                  <span className="text-cyan-300 font-mono font-semibold">{selectedAccount.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sand-muted text-[11px]">
                  <span className="text-white/40 w-16 font-mono">Subject:</span>
                  <span className="text-sand-muted truncate">{testEmailSession?.subject}</span>
                </div>
              </div>

              {/* Single-Use 6-Digit Code Highlight */}
              <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/25 rounded-xl flex items-center justify-between mt-3">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-cyan-300">
                    Single-Use 6-Digit Authorization Code
                  </div>
                  <div className="text-3xl font-mono font-bold tracking-[0.35em] text-ivory mt-0.5">
                    {testEmailSession?.code || '••••••'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (testEmailSession?.code) {
                      navigator.clipboard.writeText(testEmailSession.code);
                      setCopiedKey(true);
                      setTimeout(() => setCopiedKey(false), 2000);
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition-all"
                  title="Copy 6-digit code"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-sand-muted leading-relaxed font-light">
              This 6-digit verification code has been dispatched to <strong className="text-ivory font-mono">{selectedAccount.email}</strong>. It remains valid for 10 minutes and will be consumed immediately upon operator login.
            </p>

            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-ivory text-xs font-semibold transition"
            >
              Close Dispatch Preview
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: DELETE CONFIRMATION (SUPER ADMIN OTP PROTECTED REVOCATION)         */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && selectedAccount && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-[#0B1014] border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto overscroll-contain my-auto">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-display text-2xl text-ivory font-light">
                  Revoke Staff Clearance
                </h3>
                <p className="text-xs text-rose-300">OTP-Protected Super Admin Action</p>
              </div>
            </div>

            <p className="text-xs text-sand-muted leading-relaxed">
              Are you sure you want to permanently delete the credentials and active 2FA tokens for <strong className="text-ivory">{selectedAccount.fullName}</strong> (<span className="font-mono">{selectedAccount.email}</span>)? This action is irreversible.
            </p>

            <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
              otpRemainingMs > 0
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <div className="space-y-0.5">
                <div className="font-semibold">
                  {otpRemainingMs > 0 ? 'Super Admin OTP Window Active' : 'OTP Verification Required'}
                </div>
                <div className="text-[11px] opacity-80">
                  {otpRemainingMs > 0 
                    ? `Authorized for next ${Math.floor(otpRemainingMs / 60000)}m ${Math.floor((otpRemainingMs % 60000) / 1000)}s without re-prompting.`
                    : 'Clicking Authorize Revocation will prompt for your 6-digit Super Admin OTP.'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedAccount(null);
                }}
                className="px-4 py-2 text-sand-muted hover:text-ivory transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold tracking-wider shadow-lg shadow-rose-600/30 transition active:scale-95 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Authorize Revocation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: SUPER ADMIN 2-MINUTE OTP STEP-UP CHALLENGE                       */}
      {/* ========================================================================= */}
      <SuperAdminOtpChallengeModal
        isOpen={isOtpChallengeOpen}
        onClose={() => {
          setIsOtpChallengeOpen(false);
          setPendingSuperAdminAction(null);
        }}
        onSuccess={handleOtpChallengeSuccess}
        adminEmail={currentAdminEmail}
        actionTitle={pendingSuperAdminAction?.title || 'Super Admin Action'}
        actionDescription={pendingSuperAdminAction?.description || 'Security verification required to authorize this high-clearance administrative modification.'}
      />
    </div>
  );
};
