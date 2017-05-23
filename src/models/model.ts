class Model {

    public get(key: string): any {
        return this[key];
    }

    public set(key: string, value: any) {
        this[key] = value;
    }

}

export { Model }
