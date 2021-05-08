export interface StatelessTokenDecoder {
  decode: (statelessToken: string) => Record<string, any>;
}
