import { TestingTool } from '../../src';
import app from '../fixtureapp/app.api-typed';
import { Recipe } from '../fixtureapp/entities/Recipe';

describe('@ApiResource', (): void => {
  const tt = new TestingTool(app);

  describe('Generates LCRUD endpoints for entity decorated with @ApiResource (Recipe)', (): void => {
    test.todo('POST /recipe creates an entity');

    test.todo('GET /recipe lists entities');

    test('GET /recipe/:id returns the entity', async (): Promise<void> => {
      const repository = tt.getRepository(Recipe);
      const recipe = repository.create({
        title: 'Tiramisu',
        description: 'Most delicious cake.',
        complexity: 1,
        timeRequired: 15,
      });
      await repository.save(recipe);

      const { body } = await tt.get(`/recipe/${recipe.id}`).expect(200);
      console.log(body);
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

    test.todo('PATCH /recipe/:id updates the entity and returns updated data');

    test.todo('DELETE /recipe/:id deletes the entity');
  });
});
