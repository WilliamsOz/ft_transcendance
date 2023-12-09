import { Injectable } from '@nestjs/common';
import { Blocked, PrismaClient} from '@prisma/client';

@Injectable()
export class BlockedService {
  constructor(private readonly prisma: PrismaClient) {}
  
    async findById(id: number): Promise<Blocked | null> {
      return await this.prisma.blocked.findUnique({
        where: { id },
      });
    }
    async find_Blocked_user(id: number): Promise<Blocked | null> {
      return await this.prisma.blocked.findUnique({
        where: { id },
      });
    }
    async find_Blocker_user(id: number): Promise<Blocked | null> {
      return await this.prisma.blocked.findUnique({
        where: { id },
      });
    }
    async create(data: any): Promise<Blocked | null > {
        return await this.prisma.blocked.create({
        data,
        });
    }
}
