export class Lock {
    inSession: boolean = false;
    start(): void {
        this.inSession = true;
    }
    stop(): void {
        this.inSession = false;
    }
}