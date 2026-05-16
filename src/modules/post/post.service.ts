import type { Post } from "../../../generated/prisma/client";
import type { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "updatedAt" | "createdAt">,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPost = async ({
  search,
  tags,
  isFeatured,
  authorId,
  page,
  limit,
  skip,
  sortby,
  sortOrder,
}: {
  search?: string | undefined;
  tags?: string[] | undefined;
  isFeatured: boolean | undefined;
  authorId: string | undefined;
  page: number;
  skip: number;
  limit: number;
  sortby: string;
  sortOrder: string;
}) => {
  const andCondition: PostWhereInput[] = [];
  if (search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }
  if (tags && tags.length > 0) {
    andCondition.push({
      tags: {
        hasEvery: tags,
      },
    });
  }
  if (typeof isFeatured === "boolean") {
    andCondition.push({
      isFeatured,
    });
  }
  if (authorId) {
    andCondition.push({
      authorId,
    });
  }
  const data = await prisma.post.findMany({
    skip: skip,
    take: limit,
    where: {
      AND: andCondition,
    },
    orderBy: { [sortby]: sortOrder },
  });
  const totaldata = await prisma.post.count();
  return {
    data,
    totaldata,
    page,
    limit,
    totalpages: Math.ceil(totaldata / limit),
  };
};

const getSingleData = async (payload: { postId: string }) => {
  console.log(payload);
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: payload.postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const esixtinid = await prisma.post.findUnique({
      where: {
        id: payload.postId,
      },
    });
    return esixtinid;
  });
};
export const createService = { createPost, getAllPost, getSingleData };
