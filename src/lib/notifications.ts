import { prisma } from "./prisma"
import { NotificationType } from "@/generated/prisma"

export async function createNotification(params: {
  tipo: NotificationType
  titulo: string
  mensagem: string
  link?: string
  userId?: string
}) {
  return prisma.notification.create({
    data: params,
  })
}

export async function getUnreadCount(userId?: string) {
  return prisma.notification.count({
    where: {
      lida: false,
      ...(userId ? { userId } : {}),
    },
  })
}
