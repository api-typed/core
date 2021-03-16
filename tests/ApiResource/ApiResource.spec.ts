import { TestingTool } from '../../src';
import app from '../fixtureapp/app.api-typed';
import { Ingredient } from '../fixtureapp/entities/Ingredient';
import { Recipe } from '../fixtureapp/entities/Recipe';

describe('@ApiResource', (): void => {
  const tt = new TestingTool(app);
  let recipe: Recipe;
  let ingredient: Ingredient;

  beforeAll(
    async (): Promise<void> => {
      recipe = await tt.createEntity(Recipe, {
        title: 'Tiramisu',
        description: 'Most delicious cake.',
        complexity: 1,
        timeRequired: 15,
      });

      ingredient = await tt.createEntity(Ingredient, {
        name: 'Mascarpone',
      });
    },
  );

  describe('Generates LCRUD endpoints for entity decorated with @ApiResource', (): void => {
    describe('POST /resources', (): void => {
      test.todo('validates the input');

      test.todo('creates the entity and returns it in the response');

      test.todo(
        'returns 404 for resources that have not enabled this operation',
      );
    });

    describe('GET /resources', (): void => {
      test.todo('lists entities');

      test.todo('returns pagination meta data');

      test.todo('listings allow to go to next pages');

      test.todo(
        'returns 404 for resources that have not enabled this operation',
      );
    });

    describe('GET /resources/:id', (): void => {
      test('returns 404 if entity not found', async (): Promise<void> => {
        await tt.get('/recipes/123124').expect(404);
      });

      test.todo('returns 404 if id param is too long');

      test('returns the entity', async (): Promise<void> => {
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

      test.todo(
        'returns 404 for resources that have not enabled this operation',
      );
    });

    describe('PATCH /resources/:id', (): void => {
      test.todo('returns 404 if id param is too long');

      test.todo('returns 404 is entity is not found');

      test.todo('validates the input');

      test.todo('updates the entity and returns updated data');

      test('returns 404 for resources that have not enabled this operation', async (): Promise<void> => {
        await tt.patch(`/recipe-ingredients/${ingredient.id}`, {}).expect(404);
      });
    });

    describe('DELETE /resources/:id', (): void => {
      test.todo('returns 404 if id param is too long');

      test.todo('returns 404 if entity is not found');

      test.todo('deletes the entity');

      test('returns 404 for resources that have not enabled this operation', async (): Promise<void> => {
        await tt.delete(`/recipe-ingredients/${ingredient.id}`).expect(404);
      });
    });
  });
});
