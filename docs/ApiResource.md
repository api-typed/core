# @ApiResource

When `ApiResourceModule()` is registerd in your app (default when using `StandardProject`) you can annotate any TypeORM entity with a `@ApiResource()` decorator and automatically get REST API endpoints created.

This feature is inspired by PHP's [Api Platform](https://api-platform.com/).

## Basic example:

```ts
@Entity()
@ApiResource({
  // base path at which register the controller for this entity
  // default: generated from the entity name
  path: '/recipe-ingredients',
  // operations exposed for this resource
  // 'update' and 'delete' also available
  // default: all
  operations: ['list', 'create', 'read'],
  // on listing endpoint how many should be returned per page
  // default: 20
  perPage: 4,
  // on listing endpoint what should be the default sort order
  // default: looks for createdAt, updatedAt or id column for ASC sort
  sortDefault: {
    id: 'ASC',
  },
})
export class Ingredient {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  // validation decorators from `class-validator`
  // will be used for create and update operations
  @IsNotEmpty()
  @IsString()
  public name: string;

  @Column('enum', {
    enum: Measure,
  })
  @IsEnum(Measure)
  public measure: Measure;
}
```

The above code will automatically register 3 endpoints:

- `GET /recipe-ingredients`
- `POST /recipe-ingredients`
- `GET /recipe-ingredients/:id`

When calling `POST /recipe-ingredients` the request body will be validated against the decorators above and if validation passes an entity will be inserted into the
database and returned in the response.

Same logic applies to `PATCH /recipe-ingredients/:id` (not enabled by this example, registered for `update` operation).
