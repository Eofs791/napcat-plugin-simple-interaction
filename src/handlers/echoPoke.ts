import { NapCatPluginContext } from "napcat-types/napcat-onebot/network/plugin/types";
import { OB11FriendPokeEvent, OB11GroupPokeEvent } from "napcat-types";
import { sendGroupMessage, sendPrivateMessage } from "../index";
import { pokeMessage } from '../message';

export type GeneralPokeEvent = OB11GroupPokeEvent | OB11FriendPokeEvent;

export async function echoPoke(ctx: NapCatPluginContext, poke: GeneralPokeEvent): Promise<void> {
    if (poke.self_id !== poke.target_id) return;
    const reply = pokeMessage[Math.floor(Math.random() * pokeMessage.length)];

    if ('group_id' in poke) {
        sendGroupMessage(ctx, poke.group_id, reply);
    } else {
        sendPrivateMessage(ctx, poke.user_id, reply);
    }
}
