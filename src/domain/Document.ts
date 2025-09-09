export type Notification = {
  Timestamp: string;
  UserID: string;
  UserName: string;
  DocumentID: string;
  DocumentTitle: string;
};
export type ApiDocument = {
  ID: string;
  Title: string;
  Version: string;
  CreatedAt: string;
  UpdatedAt: string;
  Contributors: { ID: string; Name: string }[];
  Attachments: string[];
};
export interface Contributor {
  id: string;
  name: string;
}


export interface ListDocument {
  id: string;
  title: string;
  contributors: Contributor[];
  version: string;
  attachments: string[];
  createdAt: string; // ISO date string
}

export type NewDocument = Omit<ListDocument, 'id' | 'createdAt'>;