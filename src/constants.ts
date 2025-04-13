export const DEFAULT_LIMIT = 5

export const TITLE_SYSTEM_PROMPT = `
Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow those guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.
`;