import { NapCatPluginContext } from "napcat-types/napcat-onebot/network/plugin/types";
import { OB11Message } from "napcat-types";
import { pluginState } from "src/core/state";
import { sendGroupMessage } from "src";

let lastMessage = '';
let repeatCount = 1;

/**
 * 检测复读
 */
export async function checkRepeat(ctx: NapCatPluginContext, event: OB11Message): Promise<void> {
    try {
        const groupMessage = event as any;

        if (event.raw_message === lastMessage) {
            repeatCount++;

            if (repeatCount == 4) {
                repeatCount = 0;
                await sendGroupMessage(ctx, groupMessage.group_id, lastMessage);
            }
        } else {
            repeatCount = 1;
            lastMessage = event.raw_message;
        }

    } catch(error) {
        pluginState.logger.error('检测复读时出错', error);
    }
}