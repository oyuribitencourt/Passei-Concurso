import { prisma } from "./prisma"

export async function createAuditLog(params: {
  userId: string
  acao: string
  entidade: string
  entidadeId?: string
  detalhes?: string
  ip?: string
}) {
  return prisma.auditLog.create({
    data: params,
  })
}
