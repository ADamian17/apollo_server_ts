/* objectType is used to create a new type in your GraphQL schema. Let's dig into the syntax: */
import { objectType, extendType, stringArg, nonNull } from 'nexus';

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('description');
    t.nonNull.string('url');
    t.field('postedBy', {
      type: 'User',
      resolve(parent, args, context) {
        return context.prisma.link.findUnique({
          where: {
            id: Number(parent.id)
          }
        }).postedBy()
      }
    })
  }
});

/* == Query == */
export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, context) {
        return context.prisma.link.findMany();
      }
    })
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
        const newLink = context.prisma.link.create({
          data: {
            description,
            url
          }
        });
        return newLink
      },
    });
  }
});
