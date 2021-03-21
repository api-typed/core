import { TestingTool } from '../../src';
import app from '../fixtureapp/app.api-typed';
import { Ingredient, Measure } from '../fixtureapp/entities/Ingredient';
import { Rating } from '../fixtureapp/entities/Rating';
import { Recipe } from '../fixtureapp/entities/Recipe';

describe('@ApiResource', (): void => {
  const tt = new TestingTool(app);
  let rating: Rating;
  let recipe: Recipe;

  beforeAll(
    async (): Promise<void> => {
      recipe = await tt.createEntity(Recipe, {
        title: 'Tiramisu',
        description: 'Most delicious cake.',
        complexity: 1,
        timeRequired: 15,
      });

      rating = await tt.createEntity(Rating, {
        rating: 5,
      });
    },
  );

  describe('Generates LCRUD endpoints for entity decorated with @ApiResource', (): void => {
    describe('POST /resources', (): void => {
      describe('validates the input', (): void => {
        test('checks constraints', async (): Promise<void> => {
          const { body } = await tt
            .post('/recipe-ingredients', {
              name: 'Mascarpone Cheese',
              measure: 'box',
              minMeasure: 0,
              maxMeasure: 'plenty',
            })
            .expect(400);

          expect(body.errors).toBeDefined();
          expect(body.errors).toBeInstanceOf(Array);
          expect(body.errors.length).toBeGreaterThan(0);
        });

        test('checks for missing properties', async (): Promise<void> => {
          const { body } = await tt.post('/recipe-ingredients', {}).expect(400);

          expect(body.errors).toBeDefined();
          expect(body.errors).toBeInstanceOf(Array);
          const errorProperties = body.errors.map((err) => err.property);
          expect(errorProperties).toContain('name');
          expect(errorProperties).toContain('measure');
        });
      });

      describe('creates the entity', (): void => {
        test('returns it in the response', async (): Promise<void> => {
          const { body } = await tt
            .post('/recipe-ingredients', {
              name: 'Mascarpone Cheese',
              measure: 'g',
              minMeasure: 0,
              maxMeasure: 50,
            })
            .expect(201);

          expect(body).toStrictEqual({
            data: {
              // '@id': expect.any(Number),
              // '@type': 'recipe-ingredients',
              id: expect.any(Number),
              name: 'Mascarpone Cheese',
              measure: 'g',
              minMeasure: 0,
              maxMeasure: 50,
            },
            meta: {},
          });
        });

        test('ignores extra properties', async (): Promise<void> => {
          const { body } = await tt
            .post('/recipe-ingredients', {
              name: 'Mascarpone Cheese',
              measure: 'g',
              minMeasure: 0,
              maxMeasure: 50,
              description: 'Sweet and creamy it is the basis of any good cake!',
            })
            .expect(201);

          expect(body).toStrictEqual({
            data: {
              // '@id': expect.any(Number),
              // '@type': 'recipe-ingredients',
              id: expect.any(Number),
              name: 'Mascarpone Cheese',
              measure: 'g',
              minMeasure: 0,
              maxMeasure: 50,
            },
            meta: {},
          });
        });
      });

      test('returns 404 for resources that have not enabled this operation', async (): Promise<void> => {
        await tt.post('/ratings', { rating: 5 }).expect(404);
      });
    });

    describe('GET /resources', (): void => {
      test.todo('lists entities');

      test.todo('returns pagination meta data');

      test.todo('listings allow to go to next pages');

      test('returns 404 for resources that have not enabled this operation', async (): Promise<void> => {
        await tt.get('/ratings').expect(404);
      });
    });

    describe('GET /resources/:id', (): void => {
      test('returns 404 if entity not found', async (): Promise<void> => {
        await tt.get('/recipes/123124').expect(404);
      });

      test('returns 404 if id param is too long', async (): Promise<void> => {
        await tt.get('/recipes/1234567891233').expect(404);
      });

      test('returns the entity', async (): Promise<void> => {
        const { body } = await tt.get(`/recipes/${recipe.id}`).expect(200);
        expect(body).toStrictEqual({
          data: {
            // '@id': recipe.id,
            // '@type': 'recipes',
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

      test('returns 404 for resources that have not enabled this operation', async (): Promise<void> => {
        await tt.get(`/ratings/${rating.id}`).expect(404);
      });
    });

    describe('PATCH /resources/:id', (): void => {
      test('returns 404 if id param is too long', async (): Promise<void> => {
        await tt
          .patch('/recipes/1234567891233', { title: 'Misutira' })
          .expect(404);
      });

      test('returns 404 is entity is not found', async (): Promise<void> => {
        await tt.patch('/recipes/123124', {}).expect(404);
      });

      test.todo('validates the input');

      test.todo('updates the entity and returns updated data');

      test('returns 404 for resources that have not enabled this operation', async (): Promise<void> => {
        await tt.patch(`/ratings/${rating.id}`, { rating: 4 }).expect(404);
      });
    });

    describe('DELETE /resources/:id', (): void => {
      test('returns 404 if id param is too long', async (): Promise<void> => {
        await tt.delete('/recipes/1234567891233').expect(404);
      });

      test('returns 404 if entity is not found', async (): Promise<void> => {
        await tt.delete('/recipes/123124').expect(404);
      });

      test('deletes the entity', async (): Promise<void> => {
        const salt = await tt.createEntity(Ingredient, {
          name: 'Salt',
          measure: Measure.pinch,
        });
        expect(salt.id).toBeDefined();

        await tt.get(`/recipe-ingredients/${salt.id}`).expect(200);

        await tt.delete(`/recipe-ingredients/${salt.id}`).expect(204);

        const freshSalt = await tt.getRepository(Ingredient).findOne(salt.id);
        expect(freshSalt).toBeUndefined();
      });

      test('returns 404 for resources that have not enabled this operation', async (): Promise<void> => {
        await tt.delete(`/ratings/${rating.id}`).expect(404);
      });
    });
  });
});
