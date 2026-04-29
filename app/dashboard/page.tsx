'use client';

// Dashboard — client component for interactive UI
// In production this would fetch real data from an API/DB

import { useState } from 'react';
import Link from 'next/link';

const UPCOMING = [
  { subject: 'Mathematics', emoji: '∑', date: 'Tomorrow', time: '10:00 AM', tutor: 'Dr. Karim Saad',   gradient: 'from-blue-600 to-indigo-700' },
  { subject: 'Physics',     emoji: '⚛', date: 'Wed 1 May', time: '02:00 PM', tutor: 'Mr. Tarek Nour',  gradient: 'from-violet-600 to-purple-700' },
  { subject: 'Chemistry',   emoji: '⚗', date: 'Fri 3 May',  time: '11:00 AM', tutor: 'Ms. Dina Mostafa', gradient: 'from-emerald-600 to-teal-700' },
];

const PROGRESS = [
  { subject: 'Mathematics', progress: 78, color: 'from-blue-500 to-indigo-600', widthClass: 'w-[78%]' },
  { subject: 'Physics',     progress: 62, color: 'from-violet-500 to-purple-600', widthClass: 'w-[62%]' },
  { subject: 'Chemistry',   progress: 45, color: 'from-emerald-500 to-teal-600', widthClass: 'w-[45%]' },
  { subject: 'English',     progress: 90, color: 'from-amber-500 to-orange-600', widthClass: 'w-[90%]' },
];

const ACTIVITY = [
  { text: 'Completed Mathematics session — Algebra revision',       time: '2 hours ago',  icon: '✓', color: 'text-emerald-400' },
  { text: 'Uploaded practice paper — Physics Wave Equations',       time: 'Yesterday',     icon: '↑', color: 'text-blue-400' },
  { text: 'Received feedback on Chemistry essay',                   time: '2 days ago',   icon: '✉', color: 'text-violet-400' },
  { text: 'Booked English Literature session for next Monday',      time: '3 days ago',   icon: '📅', color: 'text-cyan-400' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'progress'>('overview');

  return (
    <div className="pt-[70px] min-h-screen">
      <div className="max-w-7xl mx-auto container-pad py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
          <div>
            <p className="text-slate-400 text-sm">Welcome back 👋</p>
            <h1 className="text-white font-bold text-2xl md:text-3xl mt-1">Student Dashboard</h1>
          </div>
          <Link href="/booking" className="btn-primary px-5 py-2.5 text-sm">
            + Book Session
          </Link>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Sessions',   value: '24',  icon: '📚', color: 'text-indigo-400'  },
            { label: 'Hours Studied',    value: '48',  icon: '⏱',  color: 'text-violet-400' },
            { label: 'Avg. Score',       value: '82%', icon: '📊', color: 'text-cyan-400'    },
            { label: 'Subjects Active',  value: '4',   icon: '🎯', color: 'text-emerald-400' },
          ].map(stat => (
            <div key={stat.label} className="glass rounded-2xl p-5 border border-white/[0.06]">
              <span className="text-2xl block mb-2">{stat.icon}</span>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="glass rounded-2xl p-1.5 inline-flex gap-1 mb-8">
          {(['overview', 'sessions', 'progress'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upcoming sessions */}
            <div className="lg:col-span-2">
              <h2 className="text-white font-semibold mb-4">Upcoming Sessions</h2>
              <div className="space-y-3">
                {UPCOMING.map(session => (
                  <div key={session.subject} className="glass rounded-2xl p-5 border border-white/[0.06] flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${session.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                      {session.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{session.subject}</p>
                      <p className="text-slate-400 text-xs mt-0.5 truncate">with {session.tutor}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-slate-200 text-sm font-medium">{session.date}</p>
                      <p className="text-indigo-400 text-xs">{session.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div>
              <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
              <div className="glass rounded-2xl p-5 border border-white/[0.06] space-y-4">
                {ACTIVITY.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`${item.color} text-sm mt-0.5 flex-shrink-0`}>{item.icon}</span>
                    <div>
                      <p className="text-slate-300 text-sm leading-snug">{item.text}</p>
                      <p className="text-slate-500 text-xs mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div>
            <h2 className="text-white font-semibold mb-4">All Upcoming Sessions</h2>
            <div className="space-y-3">
              {UPCOMING.map(session => (
                <div key={session.subject} className="glass rounded-2xl p-6 border border-white/[0.06] flex flex-wrap items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${session.gradient} flex items-center justify-center text-2xl`}>
                    {session.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{session.subject}</p>
                    <p className="text-slate-400 text-sm">with {session.tutor}</p>
                    <p className="text-slate-500 text-xs mt-1">{session.date} at {session.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-ghost px-4 py-2 text-xs">Reschedule</button>
                    <button className="btn-primary px-4 py-2 text-xs">Join</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div>
            <h2 className="text-white font-semibold mb-6">Subject Progress</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {PROGRESS.map(item => (
                <div key={item.subject} className="glass rounded-2xl p-6 border border-white/[0.06]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-medium">{item.subject}</span>
                    <span className="text-slate-300 text-sm font-semibold">{item.progress}%</span>
                  </div>
                  <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color} ${item.widthClass} transition-all duration-1000`}
                    />
                  </div>
                  <p className="text-slate-500 text-xs mt-2">
                    {item.progress < 60 ? 'Keep going — you\'re making progress!' :
                     item.progress < 80 ? 'Great work — almost there!' :
                                          'Excellent — nearly exam-ready!'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
