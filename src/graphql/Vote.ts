import { objectType, extendType, nonNull, intArg } from 'nexus';
import { User } from '@prisma/client';

export const Vote = objectType({
  name: "Vote",
  definition(t) {
    t.nonNull.field("link", { type: "Link" })
    t.nonNull.field("user", { type: "User" })
  }
});

export const VoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("vote", {
      type: "Vote",
      args: {
        linkId: nonNull(intArg()),
      },
      async resolve(parent, args, context) {
        const { userId } = context;
        const { linkId } = args;

        if (!userId) {
          throw new Error("Cannot vote without logging in.")
        }

        const link = await context.prisma.link.update({
          where: {
            id: Number(linkId)
          },
          data: {
            voters: {
              connect: {
                id: Number(userId)
              }
            }
          }
        });

        const user = await context.prisma.user.findUnique({
          where: {
            id: Number(userId)
          }
        });

        return {
          link,
          user: user as User
        }
      }
    });
  }
});

/* What are GraphQL scalars?
As mentioned before, scalars are the basic types in a GraphQL schema, similar to the primitive types in programming languages. While doing this tutorial, you have used a few of the built-in scalar types, notably String and Int.

While the built-in scalars support most of the common use-cases, your application might need support for other custom scalars. For example, currently in our application, the Link.url field has a String scalar type. However, you might want to create an Url scalar to add custom validation logic and reject invalid urls. The benefit of scalars is that they simultaneously define the representation and validation for the primitive data types in your API. */