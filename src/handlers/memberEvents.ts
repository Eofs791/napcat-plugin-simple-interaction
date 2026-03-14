import type { OB11GroupDecreaseEvent, OB11GroupIncreaseEvent, OB11PostSendMsg } from "napcat-types";
import { OB11MessageDataType } from "napcat-types";
import type { NapCatPluginContext } from "napcat-types/napcat-onebot/network/plugin/types";
import { sendGroupMessage } from "../index";

export async function welcomeMember(ctx: NapCatPluginContext, notice: OB11GroupIncreaseEvent): Promise<void> {
    const groupId = notice.group_id;
    const userId = notice.user_id.toString();

    const message: OB11PostSendMsg['message'] = [
        {
            type: OB11MessageDataType.text,
            data: {
                text: '欢迎'
            }
        },
        {
            type: OB11MessageDataType.at,
            data: {
                qq: userId
            }
        },
        {
            type: OB11MessageDataType.text,
            data: {
                text: '入群喵'
            }
        },
    ];

    await sendGroupMessage(ctx, groupId, message);
}

export async function farewellMember(ctx: NapCatPluginContext, notice: OB11GroupDecreaseEvent): Promise<void> {
    const subType = notice.sub_type;
    const groupId = notice.group_id;
    const userId = notice.user_id;

    switch (subType) {
        case 'kick_me':
            break;
        case 'kick':
            await sendGroupMessage(ctx, groupId, `成员${userId}落地过猛`);
            break;
        default:
            await sendGroupMessage(ctx, groupId, `成员${userId}掉出了这个世界`);
            break;
    }
}