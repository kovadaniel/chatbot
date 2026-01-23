export function generateText({
  onChunk,
  onDone,
  interval = 15,
  totalWords = 10000,
}: {
  onChunk: (chunk: string) => void;
  onDone?: () => void;
  interval?: number;
  totalWords?: number;
}) {
  let cancelled = false;
  const word = "lorem";
  const chunkSize = 8;
  let generated = 0;

  const timer = setInterval(() => {
    if (cancelled || generated >= totalWords) {
      clearInterval(timer);
      onDone?.();
      return;
    }

    const chunk = Array(chunkSize).fill(word).join(" ") + " ";

    generated += chunkSize;
    onChunk(chunk);
  }, interval);

  return {
    stop() {
      cancelled = true;
      clearInterval(timer);
    },
  };
}
