import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { Action } from '@waha/core/auth/casl.types';
import { CanSession, FromParam } from '@waha/core/auth/policies';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { SessionApiParam, WorkingSessionParam } from '@waha/nestjs/params/SessionApiParam';
import {
  CreateWhatsAppListBody,
  MutateWhatsAppListChatsBody,
  RenameWhatsAppListBody,
  WhatsAppList,
} from '@waha/structures/lists.dto';

@ApiSecurity('api_key')
@Controller('api/:session/lists')
@ApiTags('📋 Lists')
@UseGuards(PoliciesGuard)
export class ListsController {
  @Get('/')
  @SessionApiParam
  @CheckPolicies(CanSession(Action.Read, FromParam('session')))
  @ApiOperation({ summary: 'Get personal WhatsApp Lists' })
  getAll(@WorkingSessionParam session: WhatsappSession): Promise<WhatsAppList[]> {
    return session.getLists();
  }

  @Post('/')
  @SessionApiParam
  @CheckPolicies(CanSession(Action.Send, FromParam('session')))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@WorkingSessionParam session: WhatsappSession, @Body() body: CreateWhatsAppListBody) {
    return session.createList(body);
  }

  @Patch('/:listId')
  @SessionApiParam
  @CheckPolicies(CanSession(Action.Send, FromParam('session')))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  rename(
    @WorkingSessionParam session: WhatsappSession,
    @Param('listId') listId: string,
    @Body() body: RenameWhatsAppListBody,
  ) {
    return session.renameList(listId, body);
  }

  @Delete('/:listId')
  @SessionApiParam
  @CheckPolicies(CanSession(Action.Send, FromParam('session')))
  delete(@WorkingSessionParam session: WhatsappSession, @Param('listId') listId: string) {
    return session.deleteList(listId);
  }

  @Get('/:listId/chats')
  @SessionApiParam
  @CheckPolicies(CanSession(Action.Read, FromParam('session')))
  getChats(@WorkingSessionParam session: WhatsappSession, @Param('listId') listId: string) {
    return session.getListChats(listId);
  }

  @Post('/:listId/chats')
  @SessionApiParam
  @CheckPolicies(CanSession(Action.Send, FromParam('session')))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  addChats(
    @WorkingSessionParam session: WhatsappSession,
    @Param('listId') listId: string,
    @Body() body: MutateWhatsAppListChatsBody,
  ) {
    return session.mutateListChats(listId, body.chatIds, 'add');
  }

  @Delete('/:listId/chats')
  @SessionApiParam
  @CheckPolicies(CanSession(Action.Send, FromParam('session')))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  removeChats(
    @WorkingSessionParam session: WhatsappSession,
    @Param('listId') listId: string,
    @Body() body: MutateWhatsAppListChatsBody,
  ) {
    return session.mutateListChats(listId, body.chatIds, 'remove');
  }
}
