const DEMO_MESSAGE =
  "Wersja demonstracyjna: Proszę skonfigurować klucz API Gemini, aby uzyskać odpowiedzi w czasie rzeczywistym. (Symulacja: System przeanalizował Twoje zapytanie i sugeruje kontakt z prawnikiem w sprawie pozwu rozwodowego).";

export const generateLegalAssistance = async (userPrompt: string, sessionId: string = 'default'): Promise<string> => {
  try {
    const resp = await fetch('/api/v1/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userPrompt,
        session_id: sessionId,
      }),
    });

    if (!resp.ok) {
      throw new Error(`Backend error: ${resp.status}`);
    }

    const data = (await resp.json()) as { text?: string };
    return data.text || "Przepraszamy, nie udało się wygenerować odpowiedzi.";
  } catch (error) {
    console.error("Gemini API Error:", error);

    return DEMO_MESSAGE;
  }
};