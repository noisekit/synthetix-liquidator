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
	let staker = StakerEntity.load(event.params.account.toHex());

	if (!staker) {
		staker = new StakerEntity(event.params.account.toHex());
		staker.count = BigInt.fromI32(0);
	}
	staker.count = BigInt.fromI32(1).plus(staker.count);

	// Flag Staker for liquidation
	staker.status = 'FLAGGED';

	staker.account = event.params.account;
	staker.timestamp = event.params.deadline;
	staker.from = event.transaction.from;

	staker.tx = event.transaction.hash;

	staker.save();
}

export function handleAccountRemovedFromLiquidation(event: AccountRemovedFromLiquidation): void {
	let staker = StakerEntity.load(event.params.account.toHex());

	if (!staker) {
		staker = new StakerEntity(event.params.account.toHex());
		staker.count = BigInt.fromI32(0);
	}
	staker.count = BigInt.fromI32(1).plus(staker.count);

	// Unflag Staker for liquidation
	staker.status = 'CLEAR';

	staker.account = event.params.account;
	staker.timestamp = event.params.time;
	staker.from = event.transaction.from;

	staker.tx = event.transaction.hash;

	staker.save();
}

export function handleAccountLiquidated(event: AccountLiquidated): void {
	let staker = StakerEntity.load(event.params.account.toHex());

	if (!staker) {
		staker = new StakerEntity(event.params.account.toHex());
		staker.count = BigInt.fromI32(0);
	}
	staker.count = BigInt.fromI32(1).plus(staker.count);

	// Liquidated account can not be flagged anymore
	if (event.params.liquidator == event.params.account) {
		staker.status = 'SELF_LIQUIDATED';
	} else {
		staker.status = 'LIQUIDATED';
	}

	staker.account = event.params.account;
	staker.timestamp = event.block.timestamp;
	staker.from = event.params.liquidator;

	staker.tx = event.transaction.hash;

	staker.save();
}

export function handleCacheUpdated(event: CacheUpdated): void {}

export function handleOwnerChanged(event: OwnerChanged): void {}

export function handleOwnerNominated(event: OwnerNominated): void {}
