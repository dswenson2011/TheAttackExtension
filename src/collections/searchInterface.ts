interface Search<T> {
    findBy(predicate: (model: T) => Boolean): T;
    findIndexBy(predicate: (model: T) => Boolean): string|number;
}

export { Search };
