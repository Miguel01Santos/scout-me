export interface ApiIssue {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  message?: string;
  issues?: ApiIssue[];
}
