import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, User } from '@prisma/client';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaClient) {} // Injectez le client Prisma
  //     async create(id: number): Promise<User> {
}
