import { range } from 'lodash';
import { TestingTool } from '../../src';
import app from '../fixtureapp/app.api-typed';
import { Ingredient, Measure } from '../fixtureapp/entities/Ingredient';
import { Rating } from '../fixtureapp/entities/Rating';
import { Recipe } from '../fixtureapp/entities/Recipe';

describe('@ApiResource', (): void => {
  const tt = new TestingTool(app);
  let rating: Rating;
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
        name: 'Amaretto',
        measure: Measure.l,
        minMeasure: 0,
        maxMeasure: 1,
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

        test('ignores id in the body', async (): Promise<void> => {
          const { body } = await tt
            .post('/recipe-ingredients', {
              id: 567,
              name: 'Mascarpone Cheese',
              measure: 'g',
              minMeasure: 0,
              maxMeasure: 50,
            })
            .expect(201);

          expect(body.data.id).not.toEqual(567);
        });
      });

      test('returns 404 for resources that have not enabled this operation', async (): Promise<void> => {
        await tt.post('/ratings', { rating: 5 }).expect(404);
      });
    });

    describe('GET /resources', (): void => {
      beforeAll(
        async (): Promise<void> => {
          await Promise.all([
            range(1, 69).map((n) =>
              tt.createEntity(Recipe, {
                title: `Recipe ${n}`,
                description: `Description ${n}`,
                complexity: n,
                timeRequired: n * 60 * 10,
              }),
            ),
          ]);
        },
      );
      test('lists entities', async (): Promise<void> => {
        const { body } = await tt.get('/recipes').expect(200);

        expect(body).toHaveProperty('data');
        expect(body.data).toBeInstanceOf(Array);
        expect(body.data).toHaveLength(20);
        expect(body.data.map((item) => item.id)).toStrictEqual(range(1, 21));
      });

      test('returns pagination meta data', async (): Promise<void> => {
        const { body } = await tt.get('/recipes').expect(200);

        expect(body).toHaveProperty('meta');
        expect(body.meta).toStrictEqual({
          links: {
            first: '/recipes',
            last: '/recipes?page=4',
            next: '/recipes?page=2',
            prev: null,
            self: '/recipes',
          },
          pagination: {
            count: 20,
            page: 1,
            perPage: 20,
            total: 69,
            totalPages: 4,
          },
        });
      });

      const makeMeta = (
        page: number,
        prevPage?: number,
        nextPage?: number,
      ) => ({
        links: {
          first: '/recipes',
          last: '/recipes?page=4',
          next: nextPage ? `/recipes?page=${nextPage}` : null,
          prev: prevPage ? `/recipes?page=${prevPage}` : null,
          self: `/recipes?page=${page}`,
        },
        pagination: {
          count: 20,
          page,
          perPage: 20,
          total: 69,
          totalPages: 4,
        },
      });

      const pages = [
        [2, makeMeta(2, 1, 3), range(21, 41)],
        [3, makeMeta(3, 2, 4), range(41, 61)],
        [
          4,
          {
            links: makeMeta(4, 3).links,
            pagination: { ...makeMeta(4, 3).pagination, count: 9 },
          },
          range(61, 70),
        ],
      ];

      test.each(pages)(
        'listings allow to go page %s',
        async (page, meta, ids): Promise<void> => {
          const { body } = await tt.get(`/recipes?page=${page}`).expect(200);
          expect(body.data.map((item) => item.id)).toStrictEqual(ids);
          expect(body.meta).toStrictEqual(meta);
        },
      );

      test.todo('allows setting how many items per page are returned');

      test.todo('allows defining default sort order');

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

      describe('validates the input', (): void => {
        test('checks constraints', async (): Promise<void> => {
          const { body } = await tt
            .patch(`/recipe-ingredients/${ingredient.id}`, {
              name: '',
              measure: 'box',
              minMeasure: 0,
              maxMeasure: 'plenty',
            })
            .expect(400);

          expect(body.errors).toBeDefined();
          expect(body.errors).toBeInstanceOf(Array);
          expect(body.errors.length).toBeGreaterThan(0);
        });
      });

      test('updates the entity and returns updated data', async (): Promise<void> => {
        const { body } = await tt
          .patch(`/recipe-ingredients/${ingredient.id}`, {
            name: 'Amaretto Liqueor',
            measure: 'l',
            minMeasure: 0,
            maxMeasure: 10,
          })
          .expect(200);

        expect(body).toStrictEqual({
          data: {
            id: ingredient.id,
            name: 'Amaretto Liqueor',
            measure: 'l',
            minMeasure: '0.00',
            maxMeasure: '10.00',
          },
          meta: {},
        });
      });

      test('does not allow to change id', async (): Promise<void> => {
        const { body } = await tt
          .patch(`/recipe-ingredients/${ingredient.id}`, {
            id: 10,
          })
          .expect(200);
        expect(body.data.id).toEqual(ingredient.id);
      });

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
