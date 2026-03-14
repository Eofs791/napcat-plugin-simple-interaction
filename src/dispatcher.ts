import { OB11EmitEventContent } from "napcat-types/napcat-onebot/network";
import { NapCatPluginContext } from "napcat-types/napcat-onebot/network/plugin/types";
import { pluginState } from "./core/state";
import { echoPoke } from "././handlers/echoPoke"
import { farewellMember, welcomeMember } from "./handlers/memberEvents";

export async function handleNotice(ctx: NapCatPluginContext, event: OB11EmitEventContent): Promise<void> {
    try {
        const notice = event as any;

        if (notice.user_id === notice.self_id) return;
        
        const noticeType = notice.notice_type;
        const noticeSubType = notice.sub_type;

        pluginState.ctx.logger.debug(`收到通知类型: ${noticeType} | 子类型: ${noticeSubType}`);

        switch (noticeType) {
            case 'notify':
                if (noticeSubType == 'poke') {
                    await echoPoke(ctx, notice);
                }
                break;
                
            case 'group_decrease':
                await farewellMember(ctx, notice);
                break;
            
            case 'group_increase':
                await welcomeMember(ctx, notice);
                break;
        }
    } catch (error) {
        pluginState.logger.error('处理通知时出错:', error);
    }
}
