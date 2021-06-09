export default interface config {
  cwd: string;
  merged: {
    output: string;
    assets: string;
    files: string[];
  };
  configFilePath: string;
  env: 'production' | 'test' | 'development';
  dynamicEntryFilePath: string;
  emitter: any;
  configFile: Buffer;
}