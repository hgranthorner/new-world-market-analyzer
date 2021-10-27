export type Ingredient = {
    quantity: number;
    cost: number;
    name: string
}

export type Recipe = {
    cost: number;
    name: string;
    ingredients: Ingredient[];
    desiredQuantity: number
}

export const recipes: Recipe[] = [
    {
        name: 'Coarse Leather',
        desiredQuantity: 1,
        ingredients: [
            {

                name: 'Raw Hide',
                quantity: 4,
                cost: .18
            }
        ],
        cost: .63
    }
]

