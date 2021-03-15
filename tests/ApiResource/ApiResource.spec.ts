import { TestingTool } from '../../src';
import app from '../fixtureapp/app.api-typed';
import { Ingredient } from '../fixtureapp/entities/Ingredient';
import { Recipe } from '../fixtureapp/entities/Recipe';

describe('@ApiResource', (): void => {
  const tt = new TestingTool(app);

  describe('Generates LCRUD endpoints for entity decorated with @ApiResource (Recipe)', (): void => {
    test.todo('POST /recipes creates an entity');

    test.todo('GET /recipes lists entities');

    test('GET /recipes/:id returns the entity', async (): Promise<void> => {
      const repository = tt.getRepository(Recipe);
      const recipe = repository.create({
        title: 'Tiramisu',
        description: 'Most delicious cake.',
        complexity: 1,
        timeRequired: 15,
      });
      await repository.save(recipe);

      const { body } = await tt.get(`/recipes/${recipe.id}`).expect(200);
      expect(body).toStrictEqual({
        data: {
          id: recipe.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          title: 'Tiramisu',
          description: 'Most delicious cake.',
          complexity: 1,
          timeRequired: 15,
        },
        meta: {},
      });
    });

    test.todo('PATCH /recipes/:id updates the entity and returns updated data');

    test.todo('DELETE /recipes/:id deletes the entity');
  });

  describe('Generates LCRUD endpoints for enabled operations with @ApiResource({ operations: []}) param (RecipeIngredient)', (): void => {
    let ingredient: Ingredient;

    beforeAll(
      async (): Promise<void> => {
        const repository = tt.getRepository(Ingredient);
        ingredient = repository.create({
          name: 'Mascarpone',
        });
        await repository.save(ingredient);
      },
    );

    test.todo('GET /recipe-ingredients lists entities');

    test.todo('POST /recipe-ingredients creates an entities');

    test.todo('GET /recipe-ingredients/:id returns the entity');

    test('PATCH /recipe-ingredients/:id returns 404', async (): Promise<void> => {
      await tt.patch(`/recipe-ingredients/${ingredient.id}`, {}).expect(404);
    });

    test('DELETE /recipe-ingredients/:id returns 404', async (): Promise<void> => {
      await tt.delete(`/recipe-ingredients/${ingredient.id}`).expect(404);
    });
  });

  describe('Listing endpoint can be paginated', (): void => {
    test.todo('Listings return pagination meta data');

    test.todo('Pagination meta data includes next and previous links');

    test.todo('Listings allow to go to next pages');
  });
});
