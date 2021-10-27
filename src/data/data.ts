export type Ingredient = {
    name: string;
    cost: number;
    quantity: number;
}

export type Recipe = {
    name: string;
    cost: number;
    bonusQuantityModifier: number;
    quantity: number;
    ingredients: Ingredient[];
}

export const recipes: Recipe[] = [
    {
        name: 'Coarse Leather',
        quantity: 1,
        bonusQuantityModifier: 0,
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

