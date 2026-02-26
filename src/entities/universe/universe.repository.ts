import { and, eq } from 'drizzle-orm';
import db from '@/db/connection';
import { universes } from './universe.schema';

export class UniverseRepository {
  async exists(id: string): Promise<boolean> {
    const result = await db
      .select({ id: universes.id })
      .from(universes)
      .where(eq(universes.id, id))
      .limit(1);
    return result.length > 0;
  }

  async isOwner(universeId: string, userId: string): Promise<boolean> {
    const result = await db
      .select({ id: universes.id })
      .from(universes)
      .where(and(eq(universes.id, universeId), eq(universes.ownerId, userId)))
      .limit(1);
    return result.length > 0;
  }

  async findById(id: string) {
    const result = await db
      .select()
      .from(universes)
      .where(eq(universes.id, id))
      .limit(1);
    return result[0] || null;
  }
}
