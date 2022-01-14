/* objectType is used to create a new type in your GraphQL schema. Let's dig into the syntax: */
import { Prisma } from '@prisma/client';
import {
  objectType,
  extendType,
  stringArg,
  nonNull,
  intArg,
  inputObjectType,
  enumType,
  arg,
  list
}
  from 'nexus';

export const Feed = objectType({
  name: "Feed",
  definition(t) {
    t.nonNull.list.nonNull.field("links", { type: 'Link' })
    t.nonNull.int("count")
  }
})

export const LinkOrderByInput = inputObjectType({
  name: "LinkOrderByInput",
  definition(t) {
    t.field("description", { type: Sort });
    t.field("url", { type: Sort });
    // t.field("createdAt", { type: Sort });
  }
});

export const Sort = enumType({
  name: "Sort",
  members: ["asc", "desc"]
});

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('description');
    t.nonNull.string('url');
    // t.nonNull.dateTime("createdAt");
    t.field('postedBy', {
      type: 'User',
      resolve(parent, args, context) {
        return context.prisma.link.findUnique({
          where: {
            id: Number(parent.id)
          }
        }).postedBy()
      }
    });
    t.nonNull.list.nonNull.field("voters", {
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({
            where: {
              id: parent.id
            }
          })
          .voters();
      }
    })
  }
});

/* == Query == */
export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feed", {
      type: "Feed",
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({
          type: list(
            nonNull(LinkOrderByInput)
          )
        })
      },
      async resolve(parent, args, context) {
        const where = args.filter
          ? {
            OR: [
              { description: { contains: args.filter } },
              { url: { contains: args.filter } },
            ]
          }
          : {}

        const links = await context.prisma.link.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput> | undefined
        });

        const count = await context.prisma.link.count({ where });

        return {
          links,
          count
        }
      }
    });
  }
});

/* == Mutation == */
export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg())
      },
      resolve(parent, args, context) {
        const { description, url } = args;
        const { userId } = context;

        const newLink = context.prisma.link.create({
          data: {
            description,
            url,
            postedBy: {
              connect: {
                id: userId
              }
            }
          }
        });
        return newLink
      },
    });
  }
});
