const SocialLink = ({ href, label, icon }) => {
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200/70 bg-white/70 px-2.5 py-1 text-xs font-medium text-ink-600 transition-colors hover:text-primary-600 dark:border-ink-700 dark:bg-ink-900/50 dark:text-ink-300"
    >
      {icon}
      {label}
    </a>
  )
}

const LeetCodeProfileHeader = ({ profile }) => (
  <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
    <img
      src={profile.avatar || 'https://assets.leetcode.com/users/default_avatar.png'}
      alt={profile.realName || profile.leetcodeUsername}
      className="h-20 w-20 rounded-2xl object-cover ring-4 ring-primary-500/20"
    />
    <div className="text-center sm:text-left">
      <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
        {profile.realName || profile.leetcodeUsername}
      </h2>
      <p className="text-sm text-ink-500 dark:text-ink-400">
        @{profile.leetcodeUsername}
        {profile.country ? ` • ${profile.country}` : ''}
      </p>
      {profile.school && <p className="text-sm text-ink-600 dark:text-ink-300">{profile.school}</p>}

      <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
        <SocialLink
          href={profile.github ? `https://github.com/${profile.github.split('/').filter(Boolean).pop()}` : ''}
          label="GitHub"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 015.8 0C17.2 4.9 18.2 5.2 18.2 5.2c.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .4.2.7.8.6a11.5 11.5 0 007.9-10.9C23.5 5.7 18.3.5 12 .5z" />
            </svg>
          }
        />
        <SocialLink
          href={profile.linkedin}
          label="LinkedIn"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2h.1c.5-.9 1.8-2 3.7-2 4 0 4.9 2.6 4.9 6V23h-4v-8.2c0-2-.1-4.3-2.7-4.3-2.7 0-3 2.1-3 4.2V23h-4V8z" />
            </svg>
          }
        />
        <SocialLink
          href={profile.twitter}
          label="Twitter"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.9 1.2h3.7l-8.1 9.3L24 22.8h-7.5l-5.9-7.7-6.7 7.7H.2l8.6-9.9L0 1.2h7.7l5.3 7 6.9-7zm-1.3 19.4h2L7 3.3H4.8l12.8 17.3z" />
            </svg>
          }
        />
        <SocialLink
          href={profile.website ? `https://${profile.website}` : ''}
          label="Website"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 010 20 15.3 15.3 0 010-20z" />
            </svg>
          }
        />
      </div>
    </div>
  </div>
)

export default LeetCodeProfileHeader
