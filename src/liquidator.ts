import { BigInt } from '@graphprotocol/graph-ts';
import {
	AccountFlaggedForLiquidation,
	AccountRemovedFromLiquidation,
	CacheUpdated,
	OwnerChanged,
	OwnerNominated,
} from '../generated/Liquidator/Liquidator';
import { AccountLiquidated } from '../generated/Synthetix/Synthetix';
import { StakerEntity } from '../generated/schema';

export function handleAccountFlaggedForLiquidation(event: AccountFlaggedForLiquidation): void {
	let entity = StakerEntity.load(event.params.account.toHex());

	if (!entity) {
		entity = new StakerEntity(event.params.account.toHex());
		entity.count = BigInt.fromI32(0);
	}
	entity.count = BigInt.fromI32(1).plus(entity.count);

	// Flag Staker for liquidation
	entity.flagged = true;

	entity.account = event.params.account;
	entity.timestamp = event.params.deadline;
	entity.from = event.transaction.from;

	entity.save();
}

export function handleAccountRemovedFromLiquidation(event: AccountRemovedFromLiquidation): void {
	let entity = StakerEntity.load(event.params.account.toHex());

	if (!entity) {
		entity = new StakerEntity(event.params.account.toHex());
		entity.count = BigInt.fromI32(0);
	}
	entity.count = BigInt.fromI32(1).plus(entity.count);

	// Unflag Staker for liquidation
	entity.flagged = false;

	entity.account = event.params.account;
	entity.timestamp = event.params.time;
	entity.from = event.transaction.from;

	entity.save();
}

export function handleAccountLiquidated(event: AccountLiquidated): void {
	let entity = StakerEntity.load(event.params.account.toHex());

	if (!entity) {
		entity = new StakerEntity(event.params.account.toHex());
		entity.count = BigInt.fromI32(0);
	}
	entity.count = BigInt.fromI32(1).plus(entity.count);

	// Liquidated account can not be flagged anymore
	entity.flagged = false;

	entity.account = event.params.account;
	entity.timestamp = event.block.timestamp;
	entity.from = event.params.liquidator;

	entity.save();
}

export function handleCacheUpdated(event: CacheUpdated): void {}

export function handleOwnerChanged(event: OwnerChanged): void {}

export function handleOwnerNominated(event: OwnerNominated): void {}
