/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DiscordEvent } from '../Enums/System';
import { Message, MessageReaction, PartialUser, User } from 'discord.js';
import Protomolecule from '../Client/Protomolecule';
import { System } from '../../Utils';

/**
 * @category Handler
 */
export class EventHandler {
	private readonly client: Protomolecule;

	public constructor(protomolecule: Protomolecule) {
		this.client = protomolecule;
	}

	public listen(): void {
		this.client.once(DiscordEvent.Ready, async() => {
			if (this.client.user)
				await this.client.user.setActivity(this.client.statusText, { type: this.client.statusType });
		});

		this.client.on(DiscordEvent.Message, async(message: Message) => {
			if (!message.content.startsWith(this.client.prefix) || message.author.bot)
				return;

			await this.client.commandHandler!.processCommand(message);
		});

		this.client.on(DiscordEvent.AddReaction,
			async(reaction: MessageReaction, user: User | PartialUser): Promise<void> => {
				if (user.bot)
					return;

				await System.processReaction(reaction, user);
			});

		this.client.on(DiscordEvent.RemoveReaction,
			async(reaction: MessageReaction, user: User | PartialUser): Promise<void> => {
				if (user.bot)
					return;

				await System.processReaction(reaction, user);
			});

		this.client.on(DiscordEvent.Disconnect, () => {
			process.exit(100);
		});
	}
}
