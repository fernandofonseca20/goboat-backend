import { getConnection, Connection, QueryRunner, In } from 'typeorm';
import { Chat, ChatMessage } from '@models';
import { IListItemChat } from '@interfaces';
// import { StringFormatter } from '@utils';

class ChatRepository {

  private relations: string[] = ['chatMessages']

  async listChatsOpen(): Promise<IListItemChat[]> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    const rows = await queryRunner.manager.find(Chat, {
      where: {
        open: true
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['user', 'lessee', 'lessee.user', 'boatRent']
    })

    const rowsResult: IListItemChat[] = await Promise.all(
      rows.map(async (chat): Promise<IListItemChat> => {

        const lastMessage = await queryRunner.manager.findOne(ChatMessage, {
          where: {
            chat: chat.id
          },
          relations: ['fromUser']
        });

        const item: IListItemChat = {
          ...chat,
          lastMessage: lastMessage || null,
        }

        return item
      }))

    await queryRunner.release();
    return rowsResult;
  }
  async listMessageByChatId(chatId: number): Promise<{
    messages: ChatMessage[], total: number
  }> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();


    const [messages, total]: [ChatMessage[], number] = await queryRunner.manager.findAndCount(ChatMessage, {
      where: {
        chat: chatId
      },
      relations: ['fromUser']
    });

    await queryRunner.release();
    return { messages, total };
  }
}

export default new ChatRepository();
