export interface StatelessTokenGenerator {
  generate: (payload: Record<string, any>) => string;
}
