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
        Value: {{ this.valueCreated(recipe) }}
      </div>
      <div>
        Cost: {{ this.ingredientsCost(recipe) }}
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
        cost: 0,
        quantity: 0,
        ingredients: [],
      } as Recipe,
      tax: 0,
      bonusMultiplier: .27
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
      return Math.ceil(r.quantity / (1 + this.bonusMultiplier))
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
      return Math.ceil(recipe.quantity / (1 + this.bonusMultiplier)) * ingredient.quantity
    },

    addIngredientToNewRecipe() {
      this.newRecipe.ingredients.push({name: "", quantity: 0, cost: 0})
    },

    saveNewRecipe() {
      this.recipes.push(this.newRecipe)
      this.newRecipe = {
        name: "",
        cost: 0,
        quantity: 0,
        ingredients: [],
      }

      window.localStorage.setItem("recipes", JSON.stringify(this.recipes))
    }
  }
})
</script>

<style scoped>
li li {
  margin-top: 1em;
}
</style>