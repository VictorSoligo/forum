import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })

    return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async createMany(attachments: QuestionAttachment[]) {
    if (attachments.length > 0) {
      const data =
        PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments)

      await this.prisma.attachment.updateMany(data)
    }
  }

  async deleteMany(attachments: QuestionAttachment[]) {
    if (attachments.length > 0) {
      const attachmentIds = attachments.map((attachment) => {
        return attachment.id.toString()
      })

      await this.prisma.attachment.deleteMany({
        where: {
          id: {
            in: attachmentIds,
          },
        },
      })
    }
  }

  async deleteManyByQuestionId(questionId: string) {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }
}
