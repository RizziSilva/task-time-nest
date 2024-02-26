export class CreateTaskRequestDto {
  idUser: number;
  title: string;
  description: string;
  link: string;
  initiatedAt: Date;
  endedAt: Date;
}
