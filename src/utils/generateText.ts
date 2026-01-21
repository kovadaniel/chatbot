export function generateText({
  onChunk,
  onDone,
  interval = 15,
  totalWords = 10000,
}: {
  onChunk: (chunk: string) => void
  onDone?: () => void
  interval?: number
  totalWords?: number
}) {
  const word = "lorem"
  const chunkSize = 8
  let generated = 0

  const timer = setInterval(() => {
    if (generated >= totalWords) {
      clearInterval(timer)
      onDone?.()
      return
    }

    const chunk =
      Array(chunkSize)
        .fill(word)
        .join(" ") + " "

    generated += chunkSize
    onChunk(chunk)
  }, interval)

  return () => clearInterval(timer)
}
