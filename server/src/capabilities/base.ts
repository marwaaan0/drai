export abstract class BaseCapability {
    abstract process(input: string): Promise<string> | string;
}
