export type PageMetadata = Array<Record<string, any>>;

export interface NavItem {
  id: string;
  href: string;
  label: string;
  active?: boolean;
  children?: NavItem[];
  defaultOpened?: boolean;
  icon?: React.ReactNode;
}

export type InterwebWtfApiKey = {
  id: string;
  key: string;
  name?: string;
  isNew?: boolean;
  createdAt?: string;
};
