import { MutableRefObject } from "react"

export type TimerStateProps = 'notStarted' | 'running' | 'paused'
export type TimerTimeoutProps = MutableRefObject<NodeJS.Timeout | null>