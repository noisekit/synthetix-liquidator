import { BigInt, crypto } from '@graphprotocol/graph-ts';
import {
	Liquidator,
	AccountFlaggedForLiquidation,
	AccountRemovedFromLiquidation,
	CacheUpdated,
	OwnerChanged,
	OwnerNominated,
} from '../generated/Liquidator/Liquidator';
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

	// Entity fields can be set based on event parameters
	entity.account = event.params.account;
	entity.deadline = event.params.deadline;
	entity.time = null;
	entity.from = event.transaction.from;

	// Entities can be written to the store with `.save()`
	entity.save();

	// Note: If a handler doesn't require existing field values, it is faster
	// _not_ to load the entity from the store. Instead, create it fresh with
	// `new Entity(...)`, set the fields that should be updated and save the
	// entity back to the store. Fields that were not set or unset remain
	// unchanged, allowing for partial updates to be applied.

	// It is also possible to access smart contracts from mappings. For
	// example, the contract that has emitted the event can be connected to
	// with:
	//
	// let contract = Contract.bind(event.address)
	//
	// The following functions can then be called on this contract to access
	// state variables and other data:
	//
	// - contract.CONTRACT_NAME(...)
	// - contract.LIQUIDATION_CALLER(...)
	// - contract.LIQUIDATION_DEADLINE(...)
	// - contract.calculateAmountToFixCollateral(...)
	// - contract.flagReward(...)
	// - contract.getLiquidationCallerForAccount(...)
	// - contract.getLiquidationDeadlineForAccount(...)
	// - contract.isLiquidationDeadlinePassed(...)
	// - contract.isLiquidationOpen(...)
	// - contract.isResolverCached(...)
	// - contract.issuanceRatio(...)
	// - contract.liquidateReward(...)
	// - contract.liquidationCollateralRatio(...)
	// - contract.liquidationDelay(...)
	// - contract.liquidationEscrowDuration(...)
	// - contract.liquidationPenalty(...)
	// - contract.liquidationRatio(...)
	// - contract.nominatedOwner(...)
	// - contract.owner(...)
	// - contract.resolver(...)
	// - contract.resolverAddressesRequired(...)
	// - contract.selfLiquidationPenalty(...)
}

export function handleAccountRemovedFromLiquidation(event: AccountRemovedFromLiquidation): void {
	let entity = StakerEntity.load(event.params.account.toHex());

	if (!entity) {
		entity = new StakerEntity(event.params.account.toHex());
		entity.count = BigInt.fromI32(0);
	}
	entity.count = BigInt.fromI32(1).plus(entity.count);

	entity.flagged = false;

	entity.account = event.params.account;
	entity.deadline = null;
	entity.time = event.params.time;
	entity.from = event.transaction.from;

	entity.save();
}

export function handleCacheUpdated(event: CacheUpdated): void {}

export function handleOwnerChanged(event: OwnerChanged): void {}

export function handleOwnerNominated(event: OwnerNominated): void {}
