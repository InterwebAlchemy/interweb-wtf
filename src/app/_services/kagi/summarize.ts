const BASE_URL = 'https://kagi.com';

const ENDPOINT = '/api/v0/summarize';

const summarizerUrl = new URL(ENDPOINT, BASE_URL);

export interface SummarizerServiceResponse {
  summary: string;
  error?: boolean;
}

export interface SummarizerResponse {
  meta: {
    id: string;
    node: string;
    ms: number;
  };
  data: {
    output: string;
    tokens: number;
  };
}

export const summarize = async (url: string | URL): Promise<SummarizerServiceResponse> => {
  try {
    const { data }: SummarizerResponse = await fetch(summarizerUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${process.env.KAGI_SUMMARIZER_TOKEN}`,
      },
      body: JSON.stringify({
        url: url.toString(),
        target_language: 'EN',
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          return await response.json();
        }
      })
      .then((response) => {
        return response;
      });

    return {
      summary: data.output,
    };
  } catch (error) {
    console.error('ERROR:', error);

    return {
      error: true,
      summary: 'Could not connect to the summarizer service',
    };
  }
};
