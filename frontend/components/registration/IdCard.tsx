'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, ShieldAlert, PhoneCall, UserCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface MemberCardData {
  token: string;
  groupId: string;
  groupName: string;
  fullName: string;
  ageRange: string;
  relationship: string;
  emergencyPhone: string;
  plannedVisitDate: string;
}

interface IdCardProps {
  member: MemberCardData;
  locale: string;
  onDeleteGroup?: () => void;
}

export default function IdCard({ member, locale, onDeleteGroup }: IdCardProps) {
  const t = useTranslations('registration');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/verify/${member.token}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, verifyUrl, {
        width: 140,
        margin: 1,
        color: {
          dark: '#1B2B4B',
          light: '#FFFFFF',
        },
      }).catch(console.error);
    }
  }, [verifyUrl]);

  const downloadCardPng = () => {
    const cardElement = document.getElementById(`id-card-${member.token}`);
    if (!cardElement) return;

    // Use HTML Canvas export pattern
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 450;
    canvas.height = 620;

    // Card background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 450, 620);

    // Header gradient
    const grad = ctx.createLinearGradient(0, 0, 450, 100);
    grad.addColorStop(0, '#1B2B4B');
    grad.addColorStop(1, '#2D4A7A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 450, 100);

    // Header text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('YATRIVA SAFETY CARD', 20, 42);
    ctx.fillStyle = '#E87722';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText('Nashik Simhastha Kumbh Mela 2027', 20, 68);

    // Member Name
    ctx.fillStyle = '#1B2B4B';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillText(member.fullName, 20, 150);

    // Age Category & Relationship
    const ageText = t(`ageCategories.${member.ageRange}` as any) || member.ageRange;
    const relText = t(`relationships.${member.relationship}` as any) || member.relationship;
    ctx.fillStyle = '#C2581A';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText(`${ageText}  |  ${relText}`, 20, 180);

    // Group & Visit Date
    ctx.fillStyle = '#5A5A5A';
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText(`Group: ${member.groupName}`, 20, 210);
    ctx.fillText(`Planned Visit: ${member.plannedVisitDate}`, 20, 230);

    // Tracking Token
    ctx.fillStyle = '#1B2B4B';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`ID: ${member.token}`, 20, 270);

    // Emergency Contact Box
    ctx.fillStyle = '#FEF3C7';
    ctx.fillRect(20, 290, 410, 70);
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 290, 410, 70);

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText('EMERGENCY CONTACT PHONE:', 35, 315);
    ctx.fillStyle = '#1B2B4B';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText(member.emergencyPhone, 35, 345);

    // QR Code draw onto main canvas
    if (canvasRef.current) {
      ctx.drawImage(canvasRef.current, 155, 380, 140, 140);
    }

    // Disclaimer
    ctx.fillStyle = '#6B7280';
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('Unofficial visitor safety card. In an emergency, dial Police 112 / Ambulance 108.', 20, 550);
    ctx.fillText('Scan QR code to view bearer contact details. No directory access.', 20, 570);

    const link = document.createElement('a');
    link.download = `Yatriva-SafetyCard-${member.token}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      id={`id-card-${member.token}`}
      className="card overflow-hidden bg-white shadow-xl rounded-2xl border border-slate-200 flex flex-col justify-between"
      style={{ width: '100%', maxWidth: '380px' }}
    >
      {/* Card Header Banner */}
      <div
        className="p-4 text-white flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #2D4A7A 100%)' }}
      >
        <div>
          <span className="block font-black text-base tracking-tight text-white">YATRIVA PILGRIM CARD</span>
          <span className="block text-[11px] font-semibold text-saffron-400" style={{ color: '#E87722' }}>
            Nashik Kumbh Mela 2027
          </span>
        </div>
        <UserCheck className="h-6 w-6 text-saffron-400" style={{ color: '#E87722' }} />
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        {/* Name & Category Badges */}
        <div>
          <h3 className="text-xl font-black text-navy-800 leading-snug" style={{ color: '#1B2B4B' }}>
            {member.fullName}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-900 border border-orange-200">
              {t(`ageCategories.${member.ageRange}` as any) || member.ageRange}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {t(`relationships.${member.relationship}` as any) || member.relationship}
            </span>
          </div>
        </div>

        {/* Tracking Token */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-semibold">Tracking ID:</span>
          <span className="font-mono font-black text-navy-800 tracking-wider" style={{ color: '#1B2B4B' }}>
            {member.token}
          </span>
        </div>

        {/* Emergency Contact Phone Highlight */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-800">
            Emergency Contact Phone:
          </span>
          <a
            href={`tel:${member.emergencyPhone}`}
            className="text-lg font-black text-navy-800 hover:underline flex items-center gap-2"
            style={{ color: '#1B2B4B' }}
          >
            <PhoneCall className="h-4 w-4 text-amber-700 shrink-0" />
            <span>{member.emergencyPhone}</span>
          </a>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <canvas ref={canvasRef} className="rounded-lg shadow-xs" />
          <span className="text-[10px] text-slate-500 font-medium">Scan to view bearer contact details</span>
        </div>

        {/* Unofficial Disclaimer */}
        <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 flex items-start gap-2 text-[10px] text-slate-600 leading-snug">
          <ShieldAlert className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>{t('disclaimer')}</span>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
        <button
          onClick={downloadCardPng}
          className="flex-1 py-2.5 px-3 rounded-xl bg-navy-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-navy-900 transition-colors shadow-xs min-h-[44px]"
          style={{ background: '#1B2B4B' }}
        >
          <Download className="h-4 w-4" />
          <span>{t('downloadPng')}</span>
        </button>

        {onDeleteGroup && (
          <button
            onClick={onDeleteGroup}
            className="py-2.5 px-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold transition-colors min-h-[44px]"
          >
            {t('deleteData')}
          </button>
        )}
      </div>
    </div>
  );
}
