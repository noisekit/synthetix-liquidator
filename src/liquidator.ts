import { BigInt, crypto } from '@graphprotocol/graph-ts';
import {
	AccountFlaggedForLiquidation,
	AccountRemovedFromLiquidation,
	CacheUpdated,
	OwnerChanged,
	OwnerNominated,
} from '../generated/Liquidator/Liquidator';
import { AccountLiquidated } from '../generated/Synthetix/Synthetix';
import { StakerEntity, LiquidationEvent } from '../generated/schema';

export function handleAccountFlaggedForLiquidation(event: AccountFlaggedForLiquidation): void {
	let status = 'FLAGGED';

	let staker = StakerEntity.load(event.params.account.toHex());

	if (!staker) {
		staker = new StakerEntity(event.params.account.toHex());
		staker.count = BigInt.fromI32(0);
	}
	staker.count = BigInt.fromI32(1).plus(staker.count);

	staker.account = event.params.account;
	staker.timestamp = event.params.deadline;
	staker.from = event.transaction.from;
	staker.status = status;

	staker.tx = event.transaction.hash;

	staker.save();

	let eventId = `${event.params.deadline.toString()}-${event.params.account.toHex()}`;
	let liquidationEvent = new LiquidationEvent(eventId);
	liquidationEvent.account = event.params.account;
	liquidationEvent.timestamp = event.params.deadline;
	liquidationEvent.from = event.transaction.from;
	liquidationEvent.status = status;
	liquidationEvent.tx = event.transaction.hash;
	liquidationEvent.save();
}

export function handleAccountRemovedFromLiquidation(event: AccountRemovedFromLiquidation): void {
	let status = 'CLEAR';

	let staker = StakerEntity.load(event.params.account.toHex());

	if (!staker) {
		staker = new StakerEntity(event.params.account.toHex());
		staker.count = BigInt.fromI32(0);
	}
	staker.count = BigInt.fromI32(1).plus(staker.count);

	staker.account = event.params.account;
	staker.timestamp = event.params.time;
	staker.from = event.transaction.from;
	staker.status = status;

	staker.tx = event.transaction.hash;

	staker.save();

	let eventId = `${event.params.time.toString()}-${event.params.account.toHex()}`;
	let liquidationEvent = new LiquidationEvent(eventId);
	liquidationEvent.account = event.params.account;
	liquidationEvent.timestamp = event.params.time;
	liquidationEvent.from = event.transaction.from;
	liquidationEvent.status = status;
	liquidationEvent.tx = event.transaction.hash;
	liquidationEvent.save();
}

export function handleAccountLiquidated(event: AccountLiquidated): void {
	let status = event.params.liquidator == event.params.account ? 'SELF_LIQUIDATED' : 'LIQUIDATED';

	let staker = StakerEntity.load(event.params.account.toHex());

	if (!staker) {
		staker = new StakerEntity(event.params.account.toHex());
		staker.count = BigInt.fromI32(0);
	}
	staker.count = BigInt.fromI32(1).plus(staker.count);

	staker.account = event.params.account;
	staker.timestamp = event.block.timestamp;
	staker.from = event.params.liquidator;
	staker.status = status;

	staker.tx = event.transaction.hash;

	staker.save();

	let eventId = `${event.block.timestamp.toString()}-${event.params.account.toHex()}`;
	let liquidationEvent = new LiquidationEvent(eventId);
	liquidationEvent.account = event.params.account;
	liquidationEvent.timestamp = event.block.timestamp;
	liquidationEvent.from = event.transaction.from;
	liquidationEvent.status = status;
	liquidationEvent.tx = event.transaction.hash;
	liquidationEvent.save();
}

export function handleCacheUpdated(event: CacheUpdated): void {}

export function handleOwnerChanged(event: OwnerChanged): void {}

export function handleOwnerNominated(event: OwnerNominated): void {}
