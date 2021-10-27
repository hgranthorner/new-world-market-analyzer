<template>
  <label>tax</label>
  <input type="number" min="0" step=".01" v-model="tax">
  <label>Bonus Multiplier</label>
  <input type="number" min="0" step=".01" v-model="bonusMultiplier">
  <ul>
    <li v-for="recipe in recipes">
      <div>
        {{ recipe.name }}
        <input type="number" min="0" step=".01" v-model="recipe.cost">
      </div>
      <div>
        Desired Quantity
        <input type="number" min="1" step="1" v-model="recipe.desiredQuantity">
      </div>
      <div>
        Craft Quantity
        {{ craftQuantity(recipe) }}
      </div>
      <ul>
        <li v-for="ingredient in recipe.ingredients">
          <div>
            {{ ingredient.name }}
            <input type="number" min="0" step=".01" v-model="ingredient.cost">
          </div>
          Required quantity: {{ ingredientQuantity(recipe, ingredient) }}
        </li>
      </ul>
      <p>Profitable? {{ valueCreated(recipe) > ingredientsCost(recipe) }}</p>

      <p>
        Value:
        {{ this.valueCreated(recipe) }}
      </p>
      <p>Cost: {{ this.ingredientsCost(recipe) }}</p>
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
      tax: 0,
      bonusMultiplier: .27
    }
  },
  methods: {
    craftQuantity(r: Recipe) {
      return Math.ceil(r.desiredQuantity / (1 + this.bonusMultiplier))
    },

    valueCreated(recipe: Recipe) {
      return recipe.desiredQuantity * recipe.cost
    },

    ingredientsCost(recipe: Recipe) {
      return recipe.ingredients
          .map(i => i.cost * this.ingredientQuantity(recipe, i))
          .reduce((x, y) => x + y)
    },

    ingredientQuantity(recipe: Recipe, ingredient: Ingredient) {
      return Math.ceil(recipe.desiredQuantity / (1 + this.bonusMultiplier)) * ingredient.quantity
    }
  }
})
</script>

<style scoped>

</style>