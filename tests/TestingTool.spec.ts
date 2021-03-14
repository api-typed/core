import { Connection, Repository } from 'typeorm';
import { HttpServices, TestingTool } from '../src';
import app from './fixtureapp/app.api-typed';
import { Ingredient } from './fixtureapp/entities/Ingredient';

describe('TestingTool', (): void => {
  const tt = new TestingTool(app);

  describe('Automatically runs the app', (): void => {
    test('Automatically migrates the database', async (): Promise<void> => {
      const pending = await tt.app.get(Connection).showMigrations();
      expect(pending).toBe(false);
    });

    test.skip('Sets up HTTP server', (): void => {
      // @todo it doesn't really listen in tests, so how to test this?
      const server = tt.app.get(HttpServices.ExpressServer);
      expect(server.listening).toBe(true);
    });
  });

  describe('Provides useful tools', (): void => {
    test('.getRepository() returns an entity repository', (): void => {
      const ingredientRepository = tt.getRepository(Ingredient);
      expect(ingredientRepository).toBeInstanceOf(Repository);
    });

    test('.get() makes GET requests', async (): Promise<void> => {
      const { body } = await tt.get('/test').expect(200);
      expect(body).toStrictEqual({
        method: 'GET',
        body: null,
      });
    });

    test('.post() makes POST requests', async (): Promise<void> => {
      const { body } = await tt
        .post('/test', { payload: 'api-typed' })
        .expect(200);

      expect(body).toStrictEqual({
        method: 'POST',
        body: { payload: 'api-typed' },
      });
    });

    test('.patch() makes PATCH requests', async (): Promise<void> => {
      const { body } = await tt
        .patch('/test', { payload: 'api-typed' })
        .expect(200);

      expect(body).toStrictEqual({
        method: 'PATCH',
        body: { payload: 'api-typed' },
      });
    });

    test('.put() makes PUT requests', async (): Promise<void> => {
      const { body } = await tt
        .put('/test', { payload: 'api-typed' })
        .expect(200);

      expect(body).toStrictEqual({
        method: 'PUT',
        body: { payload: 'api-typed' },
      });
    });

    test('.delete() makes DELETE requests', async (): Promise<void> => {
      const { body } = await tt
        .delete('/test', { payload: 'api-typed' })
        .expect(200);

      expect(body).toStrictEqual({
        method: 'DELETE',
        body: { payload: 'api-typed' },
      });
    });
  });
});
