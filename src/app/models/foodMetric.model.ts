export class FoodMetric {
    constructor(
        public name: string,
        public grams: number,
        public calories: number,
        public brand?: string
    ) {}
}