import {
	assert,
	describe,
	test,
	clearStore,
	beforeEach,
	afterEach,
} from 'matchstick-as/assembly/index';
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { StakerEntity } from '../generated/schema';
import { AccountFlaggedForLiquidation } from '../generated/Liquidator/Liquidator';
import {
	handleAccountFlaggedForLiquidation,
	handleAccountRemovedFromLiquidation,
} from '../src/liquidator';
import {
	createAccountFlaggedForLiquidationEvent,
	createAccountRemovedFromLiquidationEvent,
} from './liquidator-utils';

// 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
const FROM = '0xa16081f360e3847006db660bae1c6d1b2e17ec2a';
const ADDRESS = '0x0000000000000000000000000000000000000001';
const ADDRESS2 = '0x0000000000000000000000000000000000000002';
const ADDRESS3 = '0x0000000000000000000000000000000000000003';

describe('Describe entity assertions', () => {
	afterEach(() => {
		clearStore();
	});

	test('StakerEntity marked for liquidation is created and stored', () => {
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(234))
		);

		assert.entityCount('StakerEntity', 1);
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'account', ADDRESS);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'deadline', '234');
		assert.fieldEquals('StakerEntity', ADDRESS, 'time', 'null');
		assert.fieldEquals('StakerEntity', ADDRESS, 'flagged', 'true');
	});

	test('StakerEntity unmarked for liquidation is created and stored', () => {
		handleAccountRemovedFromLiquidation(
			createAccountRemovedFromLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(567))
		);

		assert.entityCount('StakerEntity', 1);
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'account', ADDRESS);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'deadline', 'null');
		assert.fieldEquals('StakerEntity', ADDRESS, 'time', '567');
		assert.fieldEquals('StakerEntity', ADDRESS, 'flagged', 'false');
	});

	test('StakerEntity marked and then unmarked for liquidation is created and stored', () => {
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(234))
		);

		assert.entityCount('StakerEntity', 1);
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'account', ADDRESS);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'deadline', '234');
		assert.fieldEquals('StakerEntity', ADDRESS, 'time', 'null');
		assert.fieldEquals('StakerEntity', ADDRESS, 'flagged', 'true');

		handleAccountRemovedFromLiquidation(
			createAccountRemovedFromLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(567))
		);

		assert.entityCount('StakerEntity', 1);
		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'account', ADDRESS);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '2');
		assert.fieldEquals('StakerEntity', ADDRESS, 'deadline', 'null');
		assert.fieldEquals('StakerEntity', ADDRESS, 'time', '567');
		assert.fieldEquals('StakerEntity', ADDRESS, 'flagged', 'false');
	});

	test('multiple StakerEntities marked for liquidation by a single account', () => {
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(111))
		);
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS2), BigInt.fromI32(112))
		);
		handleAccountFlaggedForLiquidation(
			createAccountFlaggedForLiquidationEvent(Address.fromString(ADDRESS3), BigInt.fromI32(113))
		);

		assert.entityCount('StakerEntity', 3);

		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS, 'flagged', 'true');
		assert.fieldEquals('StakerEntity', ADDRESS2, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS2, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS2, 'flagged', 'true');
		assert.fieldEquals('StakerEntity', ADDRESS3, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS3, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS3, 'flagged', 'true');

		handleAccountRemovedFromLiquidation(
			createAccountRemovedFromLiquidationEvent(Address.fromString(ADDRESS), BigInt.fromI32(222))
		);
		handleAccountRemovedFromLiquidation(
			createAccountRemovedFromLiquidationEvent(Address.fromString(ADDRESS2), BigInt.fromI32(223))
		);

		assert.entityCount('StakerEntity', 3);

		assert.fieldEquals('StakerEntity', ADDRESS, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS, 'count', '2');
		assert.fieldEquals('StakerEntity', ADDRESS, 'flagged', 'false');
		assert.fieldEquals('StakerEntity', ADDRESS2, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS2, 'count', '2');
		assert.fieldEquals('StakerEntity', ADDRESS2, 'flagged', 'false');
		assert.fieldEquals('StakerEntity', ADDRESS3, 'from', FROM);
		assert.fieldEquals('StakerEntity', ADDRESS3, 'count', '1');
		assert.fieldEquals('StakerEntity', ADDRESS3, 'flagged', 'true');
	});
});
