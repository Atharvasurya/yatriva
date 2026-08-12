'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { UserPlus, Trash2, ShieldAlert, ArrowLeft, Printer, CheckCircle, Smartphone } from 'lucide-react';
import IdCard, { MemberCardData } from '@/components/registration/IdCard';

interface MemberForm {
  fullName: string;
  ageRange: 'child_0_12' | 'teen_13_17' | 'adult_18_59' | 'senior_60_plus';
  relationship: 'self' | 'child' | 'parent' | 'spouse' | 'elderly_parent' | 'relative';
  memberEmergencyPhone: string;
}

export default function RegisterPage() {
  const t = useTranslations('registration');
  const locale = useLocale();

  const [groupName, setGroupName] = useState('');
  const [plannedVisitDate, setPlannedVisitDate] = useState('2027-08-31');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [members, setMembers] = useState<MemberForm[]>([
    { fullName: '', ageRange: 'adult_18_59', relationship: 'self', memberEmergencyPhone: '' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<{
    groupId: string;
    groupName: string;
    plannedVisitDate: string;
    primaryEmergencyPhone: string;
    members: MemberCardData[];
  } | null>(null);

  const addMember = () => {
    setMembers((prev) => [
      ...prev,
      { fullName: '', ageRange: 'child_0_12', relationship: 'child', memberEmergencyPhone: '' },
    ]);
  };

  const removeMember = (index: number) => {
    if (members.length <= 1) return;
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof MemberForm, value: string) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !primaryPhone.trim() || members.some((m) => !m.fullName.trim())) {
      alert('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/api/registration/group`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName,
          plannedVisitDate,
          primaryEmergencyPhone: primaryPhone,
          members,
          leaderPhone: leaderPhone || undefined,
        }),
      });

      if (!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      setCreatedGroup(data);
    } catch {
      // Local fallback generation if server is offline
      const mockGroupId = `GRP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const mockMembers: MemberCardData[] = members.map((m, i) => ({
        token: `YAT-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${i + 1}`,
        groupId: mockGroupId,
        groupName,
        fullName: m.fullName,
        ageRange: m.ageRange,
        relationship: m.relationship,
        emergencyPhone: m.memberEmergencyPhone || primaryPhone,
        plannedVisitDate,
      }));

      setCreatedGroup({
        groupId: mockGroupId,
        groupName,
        plannedVisitDate,
        primaryEmergencyPhone: primaryPhone,
        members: mockMembers,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRegistration = async () => {
    if (!createdGroup) return;
    if (confirm('Are you sure you want to delete this registration and purge all member data immediately?')) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        await fetch(`${backendUrl}/api/registration/group/${createdGroup.groupId}`, {
          method: 'DELETE',
        });
      } catch {
        // ignore
      }
      setCreatedGroup(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href={`/${locale}/login`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-600 hover:underline"
          style={{ color: '#E87722' }}
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>Optional: Leader Login</span>
        </Link>
      </div>

      {/* Title Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #2D4A7A 100%)' }}
      >
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/10 shrink-0">
            <UserPlus className="h-8 w-8 text-saffron-400" style={{ color: '#E87722' }} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">{t('title')}</h1>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Hard Privacy & Unofficial Tool Notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900 leading-relaxed font-semibold">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-0.5">Privacy & Emergency Notice:</p>
          <p>{t('disclaimer')}</p>
        </div>
      </div>

      {/* Main Registration Form OR Created Cards View */}
      {!createdGroup ? (
        <form onSubmit={handleSubmit} className="card p-6 space-y-6 bg-white rounded-2xl shadow-xl border border-slate-200">
          {/* Section 1: Group Info */}
          <div className="space-y-4 pb-6 border-b border-slate-200">
            <h2 className="text-base font-black text-navy-800 uppercase tracking-wider" style={{ color: '#1B2B4B' }}>
              1. {t('groupInfo')}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('groupName')} *
                </label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Sharma Family Group"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-navy-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('visitDate')} *
                </label>
                <input
                  type="date"
                  required
                  value={plannedVisitDate}
                  onChange={(e) => setPlannedVisitDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-navy-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('primaryPhone')} *
                </label>
                <input
                  type="tel"
                  required
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-navy-700"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Group Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-navy-800 uppercase tracking-wider" style={{ color: '#1B2B4B' }}>
                2. {t('members')}
              </h2>
              <button
                type="button"
                onClick={addMember}
                className="text-xs font-bold px-3 py-1.5 rounded-full bg-saffron-50 text-saffron-700 hover:bg-saffron-100 transition-colors border border-saffron-200"
                style={{ color: '#E87722' }}
              >
                {t('addMember')}
              </button>
            </div>

            <div className="space-y-4">
              {members.map((member, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-navy-800">
                      Member #{idx + 1}
                    </span>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Remove member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {t('memberName')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={member.fullName}
                        onChange={(e) => updateMember(idx, 'fullName', e.target.value)}
                        placeholder="Full Name"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {t('ageRange')} *
                      </label>
                      <select
                        value={member.ageRange}
                        onChange={(e) => updateMember(idx, 'ageRange', e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                      >
                        <option value="child_0_12">Child (0–12 yrs)</option>
                        <option value="teen_13_17">Teen (13–17 yrs)</option>
                        <option value="adult_18_59">Adult (18–59 yrs)</option>
                        <option value="senior_60_plus">Senior (60+ yrs)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {t('relationship')} *
                      </label>
                      <select
                        value={member.relationship}
                        onChange={(e) => updateMember(idx, 'relationship', e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                      >
                        <option value="self">Self / Leader</option>
                        <option value="child">Child</option>
                        <option value="parent">Parent</option>
                        <option value="spouse">Spouse</option>
                        <option value="elderly_parent">Elderly Parent</option>
                        <option value="relative">Relative</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Submit Button */}
          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 min-h-[48px]"
              style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #E87722 100%)' }}
            >
              {isSubmitting ? 'Generating Cards...' : t('submit')}
            </button>
          </div>
        </form>
      ) : (
        /* Generated Digital Safety Cards View */
        <div className="space-y-6 animate-fade-up">
          <div className="card p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="text-lg font-black text-emerald-900">
                Registration Complete — Group ID: {createdGroup.groupId}
              </h2>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {t('cardsSubtitle')}
              </p>
            </div>
          </div>

          {/* Optional Save for Later Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-amber-900">
                Save this registration to access across devices later?
              </p>
              <p className="text-[11px] text-amber-800">
                Optional: Enter your mobile number to attach this group to your leader account.
              </p>
            </div>
            <Link
              href={`/${locale}/login`}
              className="px-4 py-2 rounded-xl bg-navy-800 text-white font-bold text-xs shrink-0 shadow-xs min-h-[44px] flex items-center justify-center"
              style={{ background: '#1B2B4B' }}
            >
              Sign In with Mobile OTP →
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-navy-800 uppercase tracking-wider" style={{ color: '#1B2B4B' }}>
              {t('cardsTitle')} ({createdGroup.members.length})
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-800 font-bold text-xs flex items-center gap-1.5 min-h-[44px]"
              >
                <Printer className="h-4 w-4" />
                <span>{t('printAll')}</span>
              </button>

              <button
                onClick={deleteRegistration}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs min-h-[44px]"
              >
                {t('deleteData')}
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 justify-items-center">
            {createdGroup.members.map((member) => (
              <IdCard key={member.token} member={member} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
