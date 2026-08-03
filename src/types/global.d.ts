import type { SaveMeta } from './career';

export interface FMWindowApi {
  saves: {
    list: () => Promise<SaveMeta[]>;
    create: (
      name: string,
      options: { managerFirstName: string; managerLastName: string; nationality: string },
    ) => Promise<SaveMeta>;
    load: (saveId: string) => Promise<SaveMeta>;
    delete: (saveId: string) => Promise<boolean>;
  };
  db: {
    query: <T = unknown>(channel: string, payload: unknown) => Promise<T>;
  };
}

declare global {
  interface Window {
    fm?: FMWindowApi;
  }
}
