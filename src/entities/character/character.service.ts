import { eventBus } from "@/common/events/event-bus";
import { CharacterPayload } from "@/common/demitrei/demitrei.types";
import type { IFileService } from "@/common/file/file.service";
import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { CharacterRepository } from "@/entities/character/character.repository";
import type {
  Character,
  CharacterQueryParams,
  CharacterWithRelations,
  CharacterWithRelationsLean,
  CreateCharacter,
  SyncCharacterPowerAccess,
  UpdateCharacter,
} from "@/entities/character/character.types";
import type { CharacterPowerAccess } from "@/entities/power-system/power-system.types";

export class CharacterService {

  private characterRepository: CharacterRepository;
  private fileService: IFileService;

  constructor(
    characterRepository: CharacterRepository,
    fileService: IFileService,
  ) {
    this.characterRepository = characterRepository;
    this.fileService = fileService;
  }

  async createCharacter(
    data: CreateCharacter,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Character> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "character",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "character");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }
    const result = await this.characterRepository.create(data);
    if (!result.success) throw result.error;
    
    eventBus.emit("character.created", { id: result.data.id });

    return result.data;
  }

  async getCharacters(
    queryParams: CharacterQueryParams,
  ): Promise<PaginatedResponse<Character | CharacterWithRelationsLean>> {
    const result =
      await this.characterRepository.findAllWithRelations(queryParams);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getCharacterById(id: string): Promise<CharacterWithRelations | null> {
    const result = await this.characterRepository.findOneWithRelations(id);
    if (!result.success) return null;
    return result.data;
  }

  async updateCharacter(
    id: string,
    data: UpdateCharacter,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Character> {
    const existing = await this.characterRepository.findOneWithRelations(id);
    if (!existing.success) throw existing.error;
    const oldAvatarUrl = existing.data.avatarUrl;
    const oldImageUrls = existing.data.imageUrls;

    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "character",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "character");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }

    if (data.avatarUrl !== undefined && data.avatarUrl !== oldAvatarUrl) {
      if (oldAvatarUrl) void this.fileService.moveToTrash(oldAvatarUrl);
    }
    if (data.imageUrls !== undefined) {
      const newImageUrls = data.imageUrls;
      const removedImages = oldImageUrls.filter(url => !newImageUrls.includes(url));
      removedImages.forEach(url => void this.fileService.moveToTrash(url));
    }

    const result = await this.characterRepository.update(id, data);
    if (!result.success) throw result.error;

    eventBus.emit("character.updated", { id: result.data.id });

    return result.data;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    const existing = await this.characterRepository.findOneWithRelations(id);
    if (existing.success) {
      if (existing.data.avatarUrl) {
        void this.fileService.moveToTrash(existing.data.avatarUrl);
      }
      existing.data.imageUrls.forEach(url => void this.fileService.moveToTrash(url));
    }

    const result = await this.characterRepository.delete(id);
    if (!result.success) throw result.error;

    eventBus.emit("character.deleted", { id });

    return result.data;
  }

  async getPowerAccess(characterId: string): Promise<CharacterPowerAccess[]> {
    const result = await this.characterRepository.getPowerAccess(characterId);
    if (!result.success) throw result.error;
    return result.data;
  }

  async syncPowerAccess(
    characterId: string,
    data: SyncCharacterPowerAccess,
  ): Promise<CharacterPowerAccess[]> {
    const result = await this.characterRepository.syncPowerAccess(
      characterId,
      data,
    );
    if (!result.success) throw result.error;
    return result.data;
  }

  async syncAllToDemitrei(): Promise<{ total: number }> {
    const result = await this.characterRepository.findAllWithRelations({
      limit: 1000,
      page: 1,
      sortBy: "name",
      sortOrder: "asc",
    });
    if (!result.success) throw result.error;

    for (const char of result.data.data) {
      // Re-emitting the 'created' event triggers the DemitreiSubscriber sync
      eventBus.emit("character.created", { id: char.id });
    }

    return { total: result.data.pagination.totalItems };
  }

  async getDemitreiPayload(id: string): Promise<CharacterPayload> {
    const result = await this.characterRepository.findOneWithRelations(id);
    if (!result.success) throw result.error;

    const char = result.data;

    let content = `${char.name} is a ${char.type?.toLowerCase() ?? "character"}`;
    if (char.race) content += ` of the ${char.race.name} race`;
    if (char.ethnicGroup) content += `, belonging to the ${char.ethnicGroup.name} ethnic group`;
    content += `. They exist within the ${char.universe.name} universe.`;

    if (char.background) {
      content += `\n\nBackground: ${char.background}`;
    }

    return {
      id: char.id,
      type: "Character",
      name: char.name,
      content,
      metadata: {
        type: char.type ?? null,
        gender: char.gender ?? null,
        age: char.age ?? null,
        benched: char.benched,
        universe: char.universe.name,
        race: char.race?.name ?? null,
        ethnicGroup: char.ethnicGroup?.name ?? null,
      },
    };
  }

}
