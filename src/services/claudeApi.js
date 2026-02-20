export async function getRemedies(ingredients, category) {
  const response = await fetch('/.netlify/functions/getRemedies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients, category }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch remedies');
  }

  const data = await response.json();
  return data;
}
