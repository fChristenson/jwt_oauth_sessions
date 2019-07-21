export interface AccessTokenHolder {
  accessToken: string;
  ttlInSeconds: number;
  scope: string;
  createdAt: number;
}
