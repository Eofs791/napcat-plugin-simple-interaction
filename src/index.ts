import type { PluginModule } from 'napcat-types/napcat-onebot/network/plugin/types';
import { EventType } from './types';
import type { OB11PostSendMsg } from 'napcat-types/napcat-onebot';
import type { NapCatPluginContext } from 'napcat-types/napcat-onebot/network/plugin/types';
import { pluginState } from './core/state';
import { handleNotice } from './dispatcher';

export const plugin_init: PluginModule['plugin_init'] = async (ctx) => {
    try {
        pluginState.init(ctx);

        ctx.logger.info('交互插件初始化中...'); 
        ctx.logger.info('交互插件初始化完成');
    } catch (error) {
        ctx.logger.error('交互插件初始化失败:', error);
    }
};

export const plugin_onevent: PluginModule['plugin_onevent'] = async (ctx, event) => {
    
    if (event.post_type !== EventType.NOTICE) return;
    
    await handleNotice(ctx, event);
};

/**
 * 发送群消息
 */
export async function sendGroupMessage(
    ctx: NapCatPluginContext,
    groupId: number | string,
    message: OB11PostSendMsg['message']
): Promise<boolean> {
    try {
        const params: OB11PostSendMsg = {
            message,
            message_type: 'group',
            group_id: String(groupId),
        };
        await ctx.actions.call('send_msg', params, ctx.adapterName, ctx.pluginManager.config);
        return true;
    } catch (error) {
        pluginState.logger.error('发送群消息失败:', error);
        return false;
    }
}

/**
 * 发送私聊消息
 */
export async function sendPrivateMessage(
    ctx: NapCatPluginContext,
    userId: number | string,
    message: OB11PostSendMsg['message']
): Promise<boolean> {
    try {
        const params: OB11PostSendMsg = {
            message,
            message_type: 'private',
            user_id: String(userId),
        };
        await ctx.actions.call('send_msg', params, ctx.adapterName, ctx.pluginManager.config);
        return true;
    } catch (error) {
        pluginState.logger.error('发送私聊消息失败:', error);
        return false;
    }
}
