function timer () {
  const start = process.hrtime()
  return () => {
    const [s, nanos] = process.hrtime(start)
    const ms = nanos / 1000000

    if (s < 1) {
      return (ms >= 1 ? ms.toFixed(0) : ms.toFixed(2)) + 'ms'
    } else {
      return s + '.' + ms.toFixed(0) + 's'
    }
  }
}

module.exports = { timer }
