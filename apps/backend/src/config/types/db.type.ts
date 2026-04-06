export interface DbConfig {
  platform: {
    url: string;
  };
  company: DbCompanyConfig;
}

export interface DbPlatformConfig {
  url: string;
}

export interface DbCompanyConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  name: string;
}
