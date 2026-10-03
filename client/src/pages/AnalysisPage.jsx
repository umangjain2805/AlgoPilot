import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bot,
  Brain,
  Check,
  ChevronRight,
  Clock,
  ExternalLink,
  Lightbulb,
  Loader2,
  RefreshCw,
  Sparkles,
  Star,
  Target,
} from 'lucide-react'
import { useLeetCode } from '../hooks/useLeetCode.js'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { PROBLEMS } from '../lib/leetcode.js'
import PracticeTools from '../components/PracticeTools.jsx'

const timeAgo = (timestamp) => {
  if (!timestamp) return 'recently'
  const seconds = Math.floor((Date.now() - Number(timestamp) * 1000) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

const pctOf = (n, total) => (total ? Math.round((n / total) * 100) : 0)

export default function AnalysisPage() {
  const navigate = useNavigate()
  const { profile, analysis, loading, error, sync, savedAt, setSelectedTopic } = useLeetCode()
  const [activeTab, setActiveTab] = useState('topics') // 'topics' | 'curriculum' | 'insights' | 'activity'
  const [topicFilter, setTopicFilter] = useState('weak') // 'all' | 'weak' | 'mastered'

  // Coverage is measured against distinct free curated questions.
  const classifyTopic = (topic) => {
    if (topic.ratio < 0.3) return 'weak'
    if (topic.ratio < 0.6) return 'mid'
    return 'solid'
  }

  // Filter topics
  const filteredTopics =
    analysis?.topics?.filter((topic) => {
      const tier = classifyTopic(topic)
      if (topicFilter === 'weak') return tier === 'weak'
      if (topicFilter === 'mastered') return tier === 'solid'
      return true
    }) || []
  const weakCount = (analysis?.topics || []).filter((t) => classifyTopic(t) === 'weak').length
  const solidCount = (analysis?.topics || []).filter((t) => classifyTopic(t) === 'solid').length

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {!analysis && !loading && (
          <div className="neo-box-lg mx-auto max-w-lg rounded-3xl bg-white p-8 text-center sm:p-10 dark:bg-slate-900">
            <div className="mx-auto grid h-18 w-18 place-items-center rounded-2xl border-2 border-slate-900 bg-[#E2F952] text-slate-950 shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:shadow-[3px_3px_0px_0px_#f1f5f9]">
              <Brain className="h-9 w-9" />
            </div>
            <h2 className="font-display mt-5 text-2xl font-black text-slate-950 dark:text-white">
              No Profile Loaded Yet
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              Fetch your LeetCode handle to unlock full Neo-Brutalist diagnostic cards, weak spots
              matrix, and tailored interview recommendations.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="neo-btn neo-btn-electric inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black"
              >
                Go to Dashboard & Fetch
              </Link>
            </div>
            {error && (
              <div className="neo-box-sm mt-4 rounded-xl bg-rose-200 p-3 text-xs font-bold text-slate-950">
                {error}
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="neo-box-lg mx-auto max-w-md rounded-3xl bg-white p-10 text-center dark:bg-slate-900">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border-2 border-slate-900 bg-[#E2F952] text-slate-950 shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <h3 className="font-display mt-5 text-xl font-black text-slate-950 dark:text-white">
              Synthesizing LeetCode Data...
            </h3>
            <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
              Analyzing topic weak spots, contest rating, and interview curriculum coverage.
            </p>
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-8">
            {/* 1. Hero Profile Card (matching the reference profile screen) */}
            <div className="neo-box-lg relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 dark:bg-slate-900">
              {/* Decorative sparkle doodles */}
              <div className="pointer-events-none absolute right-4 top-4 text-slate-300 dark:text-slate-700">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-200 opacity-60 dark:text-slate-800">
                <Star className="h-10 w-10 fill-current" />
              </div>

              <div className="relative flex flex-col items-center text-center">
                {/* Avatar with thick border & shadow */}
                <div className="relative mb-3">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.leetcodeUsername}
                      className="h-24 w-24 rounded-3xl border-[2.5px] border-slate-900 object-cover shadow-[4px_4px_0px_0px_#0f172a] dark:border-slate-100 dark:shadow-[4px_4px_0px_0px_#f1f5f9]"
                    />
                  ) : (
                    <div className="grid h-24 w-24 place-items-center rounded-3xl border-[2.5px] border-slate-900 bg-[#E2F952] text-3xl font-black text-slate-950 shadow-[4px_4px_0px_0px_#0f172a] dark:border-slate-100 dark:shadow-[4px_4px_0px_0px_#f1f5f9]">
                      {(profile.leetcodeUsername || '?').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name + Verified Checkmark (like Lewis Webber ✔ in reference) */}
                <div className="flex items-center justify-center gap-1.5">
                  <h1 className="font-display text-2xl font-black text-slate-950 sm:text-3xl dark:text-white">
                    {profile.realName || profile.leetcodeUsername}
                  </h1>
                  <span
                    title="Public LeetCode profile"
                    className="grid h-5 w-5 place-items-center rounded-full border-1.5 border-slate-900 bg-emerald-400 text-slate-950 shadow-[1px_1px_0px_0px_#0f172a] dark:border-slate-100"
                  >
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                </div>

                {/* Handle & External Link */}
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={`https://leetcode.com/u/${profile.leetcodeUsername}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-[#E2F952]"
                  >
                    <span>@{profile.leetcodeUsername}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {savedAt && (
                    <span className="text-[10px] font-bold text-slate-400">
                      · Synced{' '}
                      {new Date(savedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>

                <p className="mt-2 max-w-lg text-xs font-medium text-slate-600 sm:text-sm dark:text-slate-400">
                  Recorded practice coverage · {analysis.streak}-day solve streak ·{' '}
                  {analysis.datasetSolved} recorded solves from curriculum.
                </p>

                {/* Segmented Stat Boxes (exact replica of 1,432 Followers | 10.0k NFTs Value | 126 NFTs Owned) */}
                <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="neo-box-sm rounded-2xl bg-[#FAFAF8] p-3 text-center sm:p-4 dark:bg-slate-800">
                    <p className="font-display text-xl font-black text-slate-950 sm:text-2xl dark:text-white">
                      {analysis.totalSolved.toLocaleString()}
                    </p>
                    <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Total Solved
                    </p>
                  </div>

                  <div className="neo-box-sm rounded-2xl bg-[#FAFAF8] p-3 text-center sm:p-4 dark:bg-slate-800">
                    <p className="font-display text-xl font-black text-slate-950 sm:text-2xl dark:text-white">
                      {analysis.acceptanceRate == null ? 'N/A' : `${analysis.acceptanceRate}%`}
                    </p>
                    <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Accepted submissions
                    </p>
                  </div>

                  <div className="neo-box-sm rounded-2xl bg-[#FAFAF8] p-3 text-center sm:p-4 dark:bg-slate-800">
                    <p className="font-display text-xl font-black text-slate-950 sm:text-2xl dark:text-white">
                      {profile.ranking ? `#${profile.ranking.toLocaleString()}` : '—'}
                    </p>
                    <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Global Rank
                    </p>
                  </div>

                  <div className="neo-box-sm rounded-2xl bg-[#FAFAF8] p-3 text-center sm:p-4 dark:bg-slate-800">
                    <p className="font-display text-xl font-black text-slate-950 sm:text-2xl dark:text-white">
                      {analysis.rating ? Math.round(analysis.rating) : `${analysis.streak}d`}
                    </p>
                    <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {analysis.rating ? 'Contest Rating' : 'Active Streak'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons Row (matching reference's Start Following + | ⋮) */}
                <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                  <Link
                    to="/"
                    className="neo-btn neo-btn-electric inline-flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 px-6 text-sm font-black shadow-[3px_3px_0px_0px_#0f172a]"
                  >
                    <span>Start Practice Session</span>
                    <span className="grid h-5 w-5 place-items-center rounded-full border border-slate-900 bg-white text-xs font-black text-slate-950">
                      +
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={sync}
                    disabled={loading}
                    className="neo-btn inline-flex items-center justify-center gap-2 rounded-2xl bg-white py-3 px-5 text-sm font-bold text-slate-900 hover:bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span>Re-sync</span>
                  </button>

                  <a
                    href={`https://leetcode.com/u/${profile.leetcodeUsername}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="neo-btn inline-flex items-center justify-center gap-1.5 rounded-2xl bg-white py-3 px-4 text-sm font-bold text-slate-900 hover:bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <PracticeTools />
            {/* 2. Navigation Tabs (matching Item's / Activity with highlighter from reference) */}
            <div className="flex border-b-2 border-slate-900 pb-2 dark:border-slate-100">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'topics', label: 'Topic Coverage', count: analysis.topics.length },
                  { id: 'curriculum', label: 'Difficulty & Core Set', count: PROBLEMS.length },
                  { id: 'insights', label: 'Practice Insights', count: analysis.insights.length },
                  {
                    id: 'activity',
                    label: 'Recent Activity',
                    count: profile.recentSubmissions?.length || 0,
                  },
                ].map((tab) => {
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative rounded-xl px-4 py-2 text-xs font-black transition-all ${
                        isActive
                          ? 'border-2 border-slate-900 bg-[#E2F952] text-slate-950 shadow-[2px_2px_0px_0px_#0f172a] dark:border-slate-100 dark:shadow-[2px_2px_0px_0px_#f1f5f9]'
                          : 'border-2 border-transparent text-slate-600 hover:border-slate-900 hover:bg-white dark:text-slate-400 dark:hover:border-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span className="ml-1.5 rounded-full border border-slate-900/60 bg-white/80 px-1.5 py-0.2 text-[10px] font-bold text-slate-900">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tab 1: Topic Mastery (Card Grid matching the reference cards with illustrations) */}
            {activeTab === 'topics' && (
              <div className="tab-enter space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-black text-slate-950 dark:text-white">
                      Topic Practice Coverage
                    </h2>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Problems solved across key interview algorithm paradigms.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex rounded-xl border-2 border-slate-900 bg-white p-1 shadow-[2px_2px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-800 dark:shadow-[2px_2px_0px_0px_#f1f5f9]">
                    <button
                      type="button"
                      onClick={() => setTopicFilter('weak')}
                      className={`rounded-lg px-3 py-1 text-xs font-black transition ${
                        topicFilter === 'weak'
                          ? 'bg-rose-400 text-slate-950'
                          : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      Weak Spots ({weakCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTopicFilter('mastered')}
                      className={`rounded-lg px-3 py-1 text-xs font-black transition ${
                        topicFilter === 'mastered'
                          ? 'bg-emerald-400 text-slate-950'
                          : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      Solid ({solidCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTopicFilter('all')}
                      className={`rounded-lg px-3 py-1 text-xs font-black transition ${
                        topicFilter === 'all'
                          ? 'bg-[#E2F952] text-slate-950'
                          : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      All ({analysis.topics.length})
                    </button>
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTopics.map((topic, index) => {
                    const tier = classifyTopic(topic)
                    const isWeak = tier === 'weak'
                    const isMid = tier === 'mid'
                    const tierLabel =
                      tier === 'weak'
                        ? 'Needs practice'
                        : tier === 'mid'
                          ? 'Developing'
                          : 'Practiced'

                    return (
                      <div
                        key={topic.name}
                        style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
                        className="topic-card card-enter neo-box group flex flex-col justify-between rounded-3xl bg-white p-5 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 dark:bg-slate-900"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-display font-black text-slate-950 dark:text-white">
                              {topic.name}
                            </span>
                            <span
                              className={`rounded-full border border-slate-900 px-2 py-0.5 text-[10px] font-black shadow-[1px_1px_0px_0px_#0f172a] ${
                                isWeak
                                  ? 'bg-rose-300 text-slate-950'
                                  : isMid
                                    ? 'bg-amber-300 text-slate-950'
                                    : 'bg-emerald-300 text-slate-950'
                              }`}
                            >
                              {tierLabel}
                            </span>
                          </div>

                          <div className="mt-3">
                            <ProgressBar
                              value={topic.solved}
                              max={topic.total}
                              className={
                                isWeak ? 'bg-rose-400' : isMid ? 'bg-amber-400' : 'bg-emerald-400'
                              }
                            />
                          </div>

                          <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            <span>
                              {topic.solved} of {topic.total} solved
                            </span>
                            <span>{topic.total - topic.solved} left</span>
                          </div>
                        </div>

                        {topic.hasCurated ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTopic(topic.name)
                              navigate('/')
                            }}
                            className="neo-btn mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#FAFAF8] py-2 text-xs font-black text-slate-900 hover:bg-[#E2F952] dark:bg-slate-800 dark:text-white dark:hover:bg-[#E2F952] dark:hover:text-slate-950"
                          >
                            <span>Practice {topic.name}</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <span className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                            No curated problems
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Difficulty & 390 Core Curriculum */}
            {activeTab === 'curriculum' && (
              <div className="tab-enter grid gap-6 lg:grid-cols-2">
                {/* Difficulty breakdown */}
                <div className="neo-box-lg rounded-3xl bg-white p-6 dark:bg-slate-900">
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 dark:border-slate-100">
                    <h3 className="font-display flex items-center gap-2 text-base font-black text-slate-950 dark:text-white">
                      <BarChart3 className="h-5 w-5" />
                      Difficulty Breakdown
                    </h3>
                    <span className="neo-box-sm rounded-full bg-[#E2F952] px-2.5 py-0.5 text-xs font-black text-slate-950">
                      {analysis.totalSolved} total
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* Easy */}
                    <div className="neo-box-sm rounded-2xl bg-white p-4 dark:bg-slate-800">
                      <div className="mb-2 flex items-center justify-between text-sm font-bold">
                        <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <span className="h-2.5 w-2.5 rounded-full border border-slate-900 bg-emerald-400" />
                          Easy
                        </span>
                        <div>
                          <span className="font-black text-slate-950 dark:text-white">
                            {analysis.easySolved}
                          </span>
                          <span className="ml-1.5 text-xs text-slate-500">
                            ({pctOf(analysis.easySolved, analysis.totalSolved)}%)
                          </span>
                        </div>
                      </div>
                      <ProgressBar
                        value={analysis.easySolved}
                        max={analysis.totalSolved || 1}
                        className="bg-emerald-400"
                      />
                    </div>

                    {/* Medium */}
                    <div className="neo-box-sm rounded-2xl bg-white p-4 dark:bg-slate-800">
                      <div className="mb-2 flex items-center justify-between text-sm font-bold">
                        <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                          <span className="h-2.5 w-2.5 rounded-full border border-slate-900 bg-amber-400" />
                          Medium
                        </span>
                        <div>
                          <span className="font-black text-slate-950 dark:text-white">
                            {analysis.mediumSolved}
                          </span>
                          <span className="ml-1.5 text-xs text-slate-500">
                            ({pctOf(analysis.mediumSolved, analysis.totalSolved)}%)
                          </span>
                        </div>
                      </div>
                      <ProgressBar
                        value={analysis.mediumSolved}
                        max={analysis.totalSolved || 1}
                        className="bg-amber-400"
                      />
                    </div>

                    {/* Hard */}
                    <div className="neo-box-sm rounded-2xl bg-white p-4 dark:bg-slate-800">
                      <div className="mb-2 flex items-center justify-between text-sm font-bold">
                        <span className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                          <span className="h-2.5 w-2.5 rounded-full border border-slate-900 bg-rose-400" />
                          Hard
                        </span>
                        <div>
                          <span className="font-black text-slate-950 dark:text-white">
                            {analysis.hardSolved}
                          </span>
                          <span className="ml-1.5 text-xs text-slate-500">
                            ({pctOf(analysis.hardSolved, analysis.totalSolved)}%)
                          </span>
                        </div>
                      </div>
                      <ProgressBar
                        value={analysis.hardSolved}
                        max={analysis.totalSolved || 1}
                        className="bg-rose-400"
                      />
                    </div>
                  </div>

                  <div className="neo-box-sm mt-5 rounded-2xl bg-[#E2F952] p-4 text-xs font-bold text-slate-950">
                    <span className="font-black">Coaching Diagnosis:</span> {analysis.insights[1]}
                  </div>
                </div>

                {/* Curated Core Tracker */}
                <div className="neo-box-lg rounded-3xl bg-white p-6 dark:bg-slate-900">
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 dark:border-slate-100">
                    <h3 className="font-display flex items-center gap-2 text-base font-black text-slate-950 dark:text-white">
                      <Target className="h-5 w-5" />
                      Core Curriculum Coverage
                    </h3>
                    <span className="neo-box-sm rounded-full bg-white px-2.5 py-0.5 text-xs font-black text-slate-950 dark:bg-slate-800 dark:text-white">
                      {PROBLEMS.length} tracked
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                    Calculated against the 390 core interview problems (Blind 75 + NeetCode 150 +
                    FAANG essentials).
                  </p>

                  <div className="mt-6 flex items-center gap-5">
                    <div className="neo-box grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-[#E2F952] text-center text-slate-950">
                      <div>
                        <span className="font-display text-3xl font-black">
                          {Math.round((analysis.datasetSolved / PROBLEMS.length) * 100)}%
                        </span>
                        <p className="text-[10px] font-black uppercase tracking-wider">Coverage</p>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600 dark:text-slate-400">Solved from set</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-black">
                          {analysis.datasetSolved}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600 dark:text-slate-400">Remaining</span>
                        <span className="text-sky-600 dark:text-sky-400 font-black">
                          {analysis.datasetUnsolved}
                        </span>
                      </div>
                      <ProgressBar
                        value={analysis.datasetSolved}
                        max={PROBLEMS.length}
                        className="bg-[#E2F952]"
                      />
                    </div>
                  </div>

                  <Link
                    to="/"
                    className="neo-btn neo-btn-electric mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-black text-slate-950"
                  >
                    <span>Train on Curriculum Problems</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Tab 3: AI Coaching Insights (Stickers & Notes) */}
            {activeTab === 'insights' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg font-black text-slate-950 dark:text-white">
                      Practice Notes
                    </h2>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Actionable intelligence derived from your historical LeetCode submission
                      patterns.
                    </p>
                  </div>
                  <span className="neo-box-sm inline-flex items-center gap-1.5 rounded-full bg-[#E2F952] px-3 py-1 text-xs font-black text-slate-950">
                    <Bot className="h-3.5 w-3.5" /> Rule-based practice advice
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {analysis.insights.map((insight, idx) => {
                    const colors = [
                      'bg-amber-100 dark:bg-amber-950/40',
                      'bg-sky-100 dark:bg-sky-950/40',
                      'bg-emerald-100 dark:bg-emerald-950/40',
                      'bg-rose-100 dark:bg-rose-950/40',
                      'bg-purple-100 dark:bg-purple-950/40',
                    ]
                    const cardBg = colors[idx % colors.length]

                    return (
                      <div
                        key={idx}
                        className={`neo-box rounded-3xl p-5 ${cardBg} flex items-start gap-3 transition-transform hover:-translate-y-0.5`}
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-slate-900 bg-white text-slate-950 shadow-[1.5px_1.5px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-800 dark:text-white">
                          <Lightbulb className="h-4 w-4" />
                        </span>
                        <p className="text-xs font-bold leading-relaxed text-slate-950 dark:text-slate-100">
                          {insight}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tab 5: Recent Activity Feed */}
            {activeTab === 'activity' && (
              <div className="neo-box-lg rounded-3xl bg-white p-6 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between border-b-2 border-slate-900 pb-3 dark:border-slate-100">
                  <h3 className="font-display flex items-center gap-2 text-base font-black text-slate-950 dark:text-white">
                    <Clock className="h-4 w-4" />
                    Recent Submissions
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    Latest {profile.recentSubmissions?.length || 0} items
                  </span>
                </div>

                <div className="divide-y-2 divide-slate-100 dark:divide-slate-800">
                  {profile.recentSubmissions?.map((sub, i) => (
                    <div
                      key={sub.submissionId || `${sub.titleSlug}-${i}`}
                      className="flex items-center justify-between py-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-slate-900 bg-slate-100 text-slate-950 shadow-[1px_1px_0px_0px_#0f172a]">
                          <Clock className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <a
                            href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                            target="_blank"
                            rel="noreferrer"
                            className="block truncate font-bold text-slate-950 hover:underline dark:text-white"
                          >
                            {sub.title}
                          </a>
                          <p className="text-[11px] font-medium text-slate-500">
                            Accepted · {timeAgo(sub.timestamp)}
                          </p>
                        </div>
                      </div>

                      <a
                        href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="neo-btn shrink-0 rounded-xl bg-white px-3 py-1 text-xs font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
                      >
                        Solve ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
