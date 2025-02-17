// add types and interfaces here
export type PageMetadata = Array<Record<string, any>>;

export type InterwebWtfApiKey = {
  id: string;
  key: string;
  name?: string;
  isNew?: boolean;
};
