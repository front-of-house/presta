export function timer () {
  const start = process.hrtime()
  return () => {
    const time = process.hrtime(start)[1] / 1000000

    return (time >= 1 ? time.toFixed(0) : time.toFixed(2)) + 'ms'
  }
}
