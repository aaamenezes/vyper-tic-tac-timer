function insertZeroBefore(value: number) {
  return `0${value}`.slice(-2)
}

export function formatMinutes(time: number) {
  return insertZeroBefore(Math.floor(time / 60))
}

export function formatSeconds(time: number) {
  return insertZeroBefore(time % 60)
}