import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { IdeaBoardRepository } from "@/entities/idea-board/idea-board.repository";
import type {
  CreateIdeaBoard,
  UpdateIdeaBoard,
  IdeaBoard,
  IdeaBoardQueryParams,
} from "@/entities/idea-board/idea-board.types";

export class IdeaBoardService {
  private ideaBoardRepository: IdeaBoardRepository;

  constructor(ideaBoardRepository: IdeaBoardRepository) {
    this.ideaBoardRepository = ideaBoardRepository;
  }

  async createIdeaBoard(data: CreateIdeaBoard): Promise<IdeaBoard> {
    const result = await this.ideaBoardRepository.createIdeaBoard(data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getIdeaBoards(
    queryParams: IdeaBoardQueryParams,
  ): Promise<PaginatedResponse<IdeaBoard>> {
    const result =
      await this.ideaBoardRepository.findAllIdeaBoards(queryParams);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getIdeaBoardById(id: string): Promise<IdeaBoard | null> {
    const result =
      await this.ideaBoardRepository.findOneIdeaBoardWithRelations(id);
    if (!result.success) return null;
    return result.data;
  }

  async updateIdeaBoard(
    id: string,
    data: UpdateIdeaBoard,
  ): Promise<IdeaBoard> {
    const result = await this.ideaBoardRepository.updateIdeaBoard(id, data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async deleteIdeaBoard(id: string): Promise<boolean> {
    const result = await this.ideaBoardRepository.deleteIdeaBoard(id);
    if (!result.success) throw result.error;
    return result.data;
  }
}
