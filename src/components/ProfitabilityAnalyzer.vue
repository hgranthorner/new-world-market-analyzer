<template>
  <div>
    Tax:
    <input type="number" min="0" step=".01" v-model="tax">
  </div>

  <div>
    Bonus Multiplier:
    <input type="number" min="0" step=".01" v-model="bonusMultiplier">
  </div>
  <ul>
    <li v-for="recipe in recipes">
      <div>
        {{ recipe.name }}
      </div>
      <div>
        Value: <input type="number" min="0" step=".01" v-model="recipe.cost">
      </div>
      <div>
        Desired Quantity
        <input type="number" min="1" step="1" v-model="recipe.quantity">
      </div>
      <div>
        Craft Quantity
        {{ craftQuantity(recipe) }}
      </div>
      <ul>
        <li v-for="ingredient in recipe.ingredients">
          <div>
            {{ ingredient.name }}
          </div>
          <div>
            Cost:
            <input type="number" min="0" step=".01" v-model="ingredient.cost">
          </div>
          Required quantity: {{ ingredientQuantity(recipe, ingredient) }}
        </li>
      </ul>
      <p>Profitable? {{ valueCreated(recipe) > ingredientsCost(recipe) }}</p>

      <div>
        Value: {{ valueCreated(recipe) }}
      </div>
      <div>
        Cost: {{ ingredientsCost(recipe) }}
      </div>
      <div>
        Profit: {{ valueCreated(recipe) - ingredientsCost(recipe) }}
      </div>
      <div>
        Profit Per Unit: {{ (valueCreated(recipe) - ingredientsCost(recipe)) / recipe.quantity }}
      </div>
      <hr>
    </li>
    <li>
      <div>
        Recipe name: <input type="text" v-model="newRecipe.name">
      </div>
      <div>
        Value: <input type="number" min="0" step=".01" v-model="newRecipe.cost">
      </div>
      <div>
        Desired Quantity:
        <input type="number" min="1" step="1" v-model="newRecipe.quantity">
      </div>
      <div>
        Craft Quantity
        {{ craftQuantity(newRecipe) }}
      </div>
      <button @click="addIngredientToNewRecipe">Add Ingredient</button>
      <ul>
        <li v-for="ingredient in newRecipe.ingredients">
          <div>
            Ingredient name: <input type="text" v-model="ingredient.name">
          </div>
          <div>
            Cost: <input type="number" min="0" step=".01" v-model="ingredient.cost">
          </div>
          <div>
            Quantity Per Recipe Unit: <input type="number" min="1" v-model="ingredient.quantity">
          </div>
          Required quantity: {{ ingredientQuantity(newRecipe, ingredient) }}
        </li>
      </ul>

      <button @click="saveNewRecipe">Save</button>
    </li>
  </ul>
  <table>
    <tr>
      <th>Desired Quantity</th>
      <th>Craft Quantity</th>
      <th>Profit</th>
      <th>Profit Per Unit</th>
    </tr>
    <tr v-for="recipe in createTestRecipes">
      <td>{{ recipe.quantity}}</td>
      <td>{{ craftQuantity(recipe).toFixed(2)}}</td>
      <td>{{ (valueCreated(recipe) - ingredientsCost(recipe)).toFixed(2) }}</td>
      <td>{{ ((valueCreated(recipe) - ingredientsCost(recipe)) / recipe.quantity).toFixed(2) }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import {Ingredient, Recipe, recipes} from "../data/data";
import {defineComponent} from "vue";

export default defineComponent({
  name: 'ProfitabilityAnalyzer',
  data() {
    return {
      recipes,
      newRecipe: {
        name: "",
        bonusQuantityModifier: 0,
        cost: 0,
        quantity: 0,
        ingredients: [],
      } as Recipe,
      tax: 0,
      bonusMultiplier: .27
    }
  },
  computed: {
    createTestRecipes(): Recipe[] {
      return new Array(100).fill(null)
          .map((_, i) => ({...this.recipes[0], quantity: i}))
    }
  },
  created() {
    const localStorageRecipes = window.localStorage.getItem("recipes")
    if (localStorageRecipes) {
      this.recipes = JSON.parse(localStorageRecipes)
    }
  },
  methods: {
    craftQuantity(r: Recipe) {
      return Math.ceil(r.quantity / (1 + this.bonusMultiplier + r.bonusQuantityModifier))
    },

    valueCreated(recipe: Recipe) {
      return recipe.quantity * recipe.cost
    },

    ingredientsCost(recipe: Recipe) {
      return recipe.ingredients
          .map(i => i.cost * this.ingredientQuantity(recipe, i))
          .reduce((x, y) => x + y)
    },

    ingredientQuantity(recipe: Recipe, ingredient: Ingredient) {
      return Math.ceil(recipe.quantity / (1 + this.bonusMultiplier + recipe.bonusQuantityModifier)) * ingredient.quantity
    },

    addIngredientToNewRecipe() {
      this.newRecipe.ingredients.push({name: "", quantity: 0, cost: 0})
    },

    saveNewRecipe() {
      this.recipes.push(this.newRecipe)
      this.newRecipe = {
        name: "",
        bonusQuantityModifier: 0,
        cost: 0,
        quantity: 0,
        ingredients: [],
      }

      window.localStorage.setItem("recipes", JSON.stringify(this.recipes))
    },

  }
})
</script>

<style scoped>
li li {
  margin-top: 1em;
}
</style>