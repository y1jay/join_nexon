import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Provide, ProvideSchema } from './schemas/provide.schema';
import { Event, EventSchema } from './schemas/event.schema';
import { EventHistory, EventHistorySchema } from './schemas/eventHistory.schema';
import { EventReward, EventRewardSchema } from './schemas/eventReward.schema';
import { Item, ItemSchema } from './schemas/item.schema';
import { EventInventory, EventInventorySchema } from './schemas/eventInventory.schema';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forRootAsync({ useFactory: () => ({ uri: process.env.DB_URL }) }),
		MongooseModule.forFeature([
			{ name: Event.name, schema: EventSchema },
			{ name: EventHistory.name, schema: EventHistorySchema },
			{ name: Item.name, schema: ItemSchema },
			{ name: EventInventory.name, schema: EventInventorySchema },
			{ name: EventReward.name, schema: EventRewardSchema },
			{ name: Provide.name, schema: ProvideSchema },
		]),
	],
	controllers: [EventController],
	providers: [EventService],
})
export class EventModule {}
