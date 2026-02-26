export type LogMetadata = Record<
  string,
  boolean | Date | null | number | Record<string, unknown> | string | undefined
>;

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export interface ContentImage {
  alt?: string;
  caption?: string;
  height?: number;
  id: string;
  url: string;
  width?: number;
}
