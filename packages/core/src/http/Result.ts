export class Result<T, E = Error> {
    private constructor(
        public readonly isSuccess: boolean,
        private readonly _value?: T,
        private readonly _error?: E
    ) {}

    public static ok<T, E = Error>(value: T): Result<T, E> {
        return new Result<T, E>(true, value);
    }

    public static fail<T, E = Error>(error: E): Result<T, E> {
        return new Result<T, E>(false, undefined, error);
    }

    public get value(): T {
        if (!this.isSuccess) {
            throw new Error('Cannot retrieve value of a failed result');
        }
        return this._value as T;
    }

    public get error(): E {
        if (this.isSuccess) {
            throw new Error('Cannot retrieve error of a successful result');
        }
        return this._error as E;
    }
}
