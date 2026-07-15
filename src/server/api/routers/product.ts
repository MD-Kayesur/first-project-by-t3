import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  // Get all products
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get the latest product created by the logged-in user
  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const product = await ctx.db.product.findFirst({
      where: { createdById: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return product ?? null;
  }),

  // Create a new product
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        details: z.string().min(1),
        price: z.number().positive(),
        images: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.product.create({
        data: {
          title: input.title,
          details: input.details,
          price: input.price,
          images: input.images,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // Delete a product owned by the logged-in user
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.product.delete({
        where: { id: input.id, createdById: ctx.session.user.id },
      });
    }),

  // PUT: Full resource replacement
  updatePut: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        details: z.string().min(1),
        price: z.number().positive(),
        images: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.product.update({
        where: { id: input.id, createdById: ctx.session.user.id },
        data: {
          title: input.title,
          details: input.details,
          price: input.price,
          images: input.images,
        },
      });
    }),

  // PATCH: Partial updates
  updatePatch: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        details: z.string().min(1).optional(),
        price: z.number().positive().optional(),
        images: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return await ctx.db.product.update({
        where: { id: id, createdById: ctx.session.user.id },
        data: updateData,
      });
    }),
});
