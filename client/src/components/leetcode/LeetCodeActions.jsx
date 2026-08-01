import Button from '../Button.jsx'

const formatLastSynced = (lastSynced) => {
  if (!lastSynced) return '—'
  const date = new Date(lastSynced)
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const LeetCodeActions = ({ onSync, onDisconnect, loading, lastSynced }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm text-ink-500 dark:text-ink-400">
      Last synced:{' '}
      <span className="font-medium text-ink-700 dark:text-ink-200">
        {formatLastSynced(lastSynced)}
      </span>
    </p>

    <div className="flex flex-col gap-3 sm:flex-row">
      <Button variant="secondary" onClick={onSync} disabled={loading} isLoading={loading}>
        {loading ? 'Syncing...' : 'Sync Now'}
      </Button>
      <Button
        variant="danger"
        onClick={onDisconnect}
        disabled={loading}
      >
        Disconnect
      </Button>
    </div>
  </div>
)

export default LeetCodeActions
