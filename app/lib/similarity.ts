export function cosineSimilarity(
  q: number[],
  c: number[]
): number {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < c.length; i++) {
    dotProduct += q[i] * c[i];
    magnitudeA += q[i] * q[i];
    magnitudeB += c[i] * c[i];
  }

  return dotProduct / (
    Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB)
  );
}